import numpy as np
import pandas as pd
import pickle
from tensorflow.keras.models import load_model
import tensorflow.keras.losses

def predict(csv_path="downloaded.csv"):
    try:
        # Load the uploaded CSV
        test_data = pd.read_csv(csv_path)

        # Load encoders
        with open('label_encoders.pkl', 'rb') as f:
            label_encoders = pickle.load(f)

        categorical_cols = ['product_category', 'warehouse_location', 'seasonality_factor', 'day_of_week', 'economic_conditions']
        for col in categorical_cols:
            if col in label_encoders:
                le = label_encoders[col]
                test_data[col] = test_data[col].apply(lambda x: le.transform([x])[0] if x in le.classes_ else -1)

        # Load scaler and transform
        with open('scaler.pkl', 'rb') as f:
            scaler = pickle.load(f)

        features = ['product_category', 'warehouse_location', 'stock_availability', 'reorder_level', 'seasonality_factor',
                    'day_of_week', 'discount(%)', 'economic_conditions', 'month', 'hour']
        X_test = scaler.transform(test_data[features])
        X_test = X_test.reshape((X_test.shape[0], 1, X_test.shape[1]))  # LSTM input shape

        # Load model with custom loss
        custom_objects = {"mse": tensorflow.keras.losses.mse}
        model = load_model("lstm_final.h5", custom_objects=custom_objects)

        # Predict multiple outputs
        preds = model.predict(X_test)
        if len(preds) == 3:
            predicted_order_qty = np.round(np.expm1(preds[0]).flatten())
            refill_flag = preds[1].round().astype(int).flatten()
            predicted_refill_qty = np.round(np.expm1(preds[2]).flatten())
        else:
            return {
                "status": "error",
                "message": "Model did not return 3 outputs as expected."
            }

        # Decode categories back to readable labels
        for col in ['product_category', 'warehouse_location', 'seasonality_factor', 'economic_conditions']:
            if col in label_encoders:
                le = label_encoders[col]
                test_data[col] = test_data[col].apply(lambda x: le.inverse_transform([int(x)])[0] if x != -1 else 'Unknown')

        # Append prediction columns
        test_data['Predicted Order Qty'] = predicted_order_qty
        test_data['Refill Needed (0/1)'] = refill_flag
        test_data['Predicted Refill Qty'] = predicted_refill_qty

        # Rename for UI
        test_data.rename(columns={
            'warehouse_location': 'Warehouse',
            'product_category': 'Category'
        }, inplace=True)

        # Prepare output
        output = test_data[['Warehouse', 'Category', 'Predicted Order Qty', 'Refill Needed (0/1)', 'Predicted Refill Qty']]
        return {
            "status": "success",
            "output": output.to_dict(orient="records")
        }

    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }
