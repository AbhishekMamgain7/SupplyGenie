from flask import Flask, request, jsonify
import firebase_admin
from firebase_admin import credentials, auth, storage
import os
from flask_cors import CORS
from predict_model import predict

app = Flask(__name__)
CORS(app)

cred = credentials.Certificate('src/Stocks/firebase-key.json')
firebase_admin.initialize_app(cred, {
    'storageBucket': 'supplygenie-11374.firebasestorage.app'
})
latest_prediction_output = {}

@app.route('/api/verify-token', methods=['POST'])
def verify_token():
    token = request.headers.get("Authorization")
    if not token:
        return jsonify({'status': 'error', 'message': 'Token missing'}), 401

    token = token.replace("Bearer ", "")
    try:
        decoded_token = auth.verify_id_token(token)
        uid = decoded_token['uid']
        return jsonify({'status': 'success', 'uid': uid}), 200
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 401


@app.route('/run_model', methods=['POST'])
def run_model():
    global latest_prediction_output

    token = request.headers.get("Authorization")
    if not token:
        return jsonify({'message': 'Token missing'}), 401

    token = token.replace("Bearer ", "")
    try:
        decoded_token = auth.verify_id_token(token)
        uid = decoded_token['uid']
    except Exception as e:
        return jsonify({'message': 'Invalid token', 'error': str(e)}), 401

    try:
        bucket = storage.bucket()
        user_folder = f'orders/{uid}/'
        
        user_blobs = list(bucket.list_blobs(prefix=user_folder))
        
        if not user_blobs:
            return jsonify({'message': 'No files found for user'}), 404

        latest_blob = max(user_blobs, key=lambda b: b.updated)
        local_filename = "downloaded.csv"
        latest_blob.download_to_filename(local_filename)

        result = predict(local_filename)
        if result["status"] == "success":
            latest_prediction_output[uid] = result["output"]
            return jsonify({"message": "Model executed successfully"}), 200
        else:
            return jsonify({"message": "Prediction failed"}), 500

    except Exception as e:
        print(f"Error occurred: {str(e)}") 
        return jsonify({'message': f'Prediction error: {str(e)}'}), 500


@app.route('/get-output', methods=['GET'])
def get_output():
    token = request.headers.get("Authorization")
    if not token:
        return jsonify({'message': 'Token missing'}), 401

    token = token.replace("Bearer ", "")
    try:
        decoded_token = auth.verify_id_token(token)
        uid = decoded_token['uid']
    except Exception as e:
        return jsonify({'message': 'Invalid token', 'error': str(e)}), 401

    try:
        output = latest_prediction_output.get(uid)
        if output:
            return jsonify({"output": output}), 200
        else:
            return jsonify({"message": "No prediction output found"}), 404
    except Exception as e:
        print(f"Error occurred: {str(e)}") 
        return jsonify({'message': str(e)}), 500


@app.route('/')
def home():
    return "🔥 Flask backend running..."


if __name__ == '__main__':
    app.run(debug=True, port=5000)
