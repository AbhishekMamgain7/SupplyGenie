from flask import Flask, request, jsonify
import firebase_admin
from firebase_admin import credentials, auth, storage
import subprocess
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Initialize Firebase Admin
cred = credentials.Certificate('firebase-key.json')  # Replace with your file
firebase_admin.initialize_app(cred, {
    'storageBucket': 'supplygenie-11374.appspot.com'
})

# ------------------------ Verify Token ------------------------ #
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

# ------------------------ Run ML Model ------------------------ #
@app.route('/run-model', methods=['POST'])
def run_model():
    token = request.headers.get("Authorization")
    if not token:
        return jsonify({'message': 'Token missing'}), 401

    token = token.replace("Bearer ", "")
    try:
        decoded_token = auth.verify_id_token(token)
        uid = decoded_token['uid']
    except Exception:
        return jsonify({'message': 'Invalid token'}), 401

    try:
        bucket = storage.bucket()
        user_folder = f'orders/{uid}/'
        blobs = list(bucket.list_blobs(prefix=user_folder))
        if not blobs:
            return jsonify({'message': 'No files found for user'}), 404

        # Get latest uploaded CSV file
        latest_blob = max(blobs, key=lambda b: b.updated)
        local_csv_path = os.path.join(os.getcwd(), 'downloaded.csv')
        latest_blob.download_to_filename(local_csv_path)

        # Run prediction script
        result = subprocess.run(['python3', 'predict_model.py'], capture_output=True, text=True)

        # Handle model errors
        if result.returncode != 0:
            return jsonify({
                'message': '❌ Model execution failed',
                'error': result.stderr
            }), 500

        # Save the model output (stdout) into file
        with open('predicted_output.txt', 'w') as f:
            f.write(result.stdout)

        return jsonify({'message': '✅ Model executed successfully!'}), 200

    except Exception as e:
        return jsonify({'message': str(e)}), 500

# ------------------------ Get Output File ------------------------ #
@app.route('/get-output', methods=['GET'])
def get_output():
    try:
        with open('predicted_output.txt', 'r') as f:
            output = f.read()
        return jsonify({'output': output}), 200
    except FileNotFoundError:
        return jsonify({'message': 'No output available'}), 404

# ------------------------ Run Flask App ------------------------ #
if __name__ == '__main__':
    app.run(debug=True, port=5176)
