import numpy as np
import pandas as pd
import pickle
import os
from tensorflow.keras.models import load_model
import tensorflow.keras.losses


def safe_transform(x, le):
    if x in le.classes_:
        return le.transform([x])[0]
    else:
        print(f"⚠️ Unknown category: {x}")
        return -1

def safe_inverse(x, le):
    try:
        return le.inverse_transform([int(x)])[0]
    except:
        return 'Unknown'

def run_model():
    if not os.path.exists("downloaded.csv"):
        print("❌ 'downloaded.csv' not found.")
        return None

    test_data = pd.read_csv("downloaded.csv")
    print("✅ Loaded input CSV:")
    print(test_data.head())

    try:
        with open('label_encoders.pkl', 'rb') as f:
            label_encoders = pickle.load(f)
    except Exception as e:
        print(f"❌ Failed to load label encoders: {e}")
        return None

    categorical_cols = ['product_category', 'warehouse_location', 'seasonality_factor', 'day_of_week', 'economic_conditions']
    for col in categorical_cols:
        if col in test_data.columns and col in label_encoders:
            le = label_encoders[col]
            test_data[col] = test_data[col].apply(lambda x: safe_transform(x, le))

    try:
        with open('scaler.pkl', 'rb') as f:
            scaler = pickle.load(f)
    except Exception as e:
        print(f"❌ Failed to load scaler: {e}")
        return None

    features = ['product_category', 'warehouse_location', 'stock_availability', 'reorder_level',
                'seasonality_factor', 'day_of_week', 'discount(%)', 'economic_conditions', 'month', 'hour']

    try:
        X_test = scaler.transform(test_data[features])
        X_test = X_test.reshape((X_test.shape[0], 1, X_test.shape[1]))
    except Exception as e:
        print(f"❌ Feature transformation error: {e}")
        return None

    try:
        custom_objects = {"mse": tensorflow.keras.losses.mse}
        model = load_model("lstm_final.h5", custom_objects=custom_objects)
    except Exception as e:
        print(f"❌ Failed to load model: {e}")
        return None

    predictions = model.predict(X_test)
    print("✅ Predictions generated.")

    if predictions.shape[1] == 3:
        pred_order_qty = predictions[:, 0]
        refill_flag = predictions[:, 1]
        refill_qty = predictions[:, 2]
    else:
        print("❌ Model output shape unexpected:", predictions.shape)
        return None

    for col in ['product_category', 'warehouse_location', 'seasonality_factor', 'economic_conditions']:
        if col in label_encoders and col in test_data.columns:
            le = label_encoders[col]
            test_data[col] = test_data[col].apply(lambda x: safe_inverse(x, le))

    test_data['Predicted Order Qty'] = np.round(np.expm1(pred_order_qty))
    test_data['Refill Needed (0/1)'] = np.round(refill_flag).astype(int)
    test_data['Predicted Refill Qty'] = np.round(np.expm1(refill_qty))

    test_data.rename(columns={
        'warehouse_location': 'Warehouse',
        'product_category': 'Category'
    }, inplace=True)

    return test_data


# ------------------ MAIN ------------------ #
if __name__ == "__main__":
    df = run_model()

    if df is not None:
        output_cols = ['Category', 'Warehouse', 'Predicted Order Qty', 'Refill Needed (0/1)', 'Predicted Refill Qty']
        if all(col in df.columns for col in output_cols):
            output = df[output_cols].to_string(index=False)
            print(output)  # 🔥 Key: Flask subprocess reads this
        else:
            print("❌ Some expected columns are missing in prediction output.")
    else:
        print("❌ Prediction failed due to earlier error. Check logs.")
