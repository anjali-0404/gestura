# **Setup and Run Guide for Gestura Project in GitHub Codespaces**

This guide explains how to run the **Gestura backend (FastAPI)** and **frontend (Flutter web)** inside a GitHub Codespace, with all ports, CORS, and proxy configurations.

---

## **Prerequisites**

* GitHub account with access to this repo.
* Codespaces enabled.
* A modern browser (Chrome/Edge/Firefox).
* Basic knowledge of terminal commands.

---

## **1️⃣ Open the repository in Codespaces**

1. Go to your GitHub repo: `https://github.com/<username>/gestura`.
2. Click **Code → Open with Codespaces → New codespace**.
3. Wait for Codespace to initialize.
4. Open **terminal inside Codespaces**.

---

## **2️⃣ Verify Flutter installation**

Check Flutter version:

```bash
flutter --version
```

Expected output (example):

```
Flutter 3.38.9 • channel stable
Dart 3.10.8
```

If Flutter is not found, ensure the Codespace has Flutter installed and added to `$PATH`:

```bash
echo 'export PATH="$HOME/flutter/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

---

## **3️⃣ Enable Flutter Web**

Flutter web must be enabled to run your frontend:

```bash
flutter config --enable-web
exec $SHELL  # restart shell so Flutter picks up web support
flutter devices
```

* You should see a `Web Server` device listed.
* If not, ensure Flutter version is stable and `web` is enabled.

---

## **4️⃣ Install backend dependencies**

Navigate to backend folder:

```bash
cd /workspaces/gestura/backend
```

Install Python dependencies (assuming `requirements.txt` exists):

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

* Key dependency: `fastapi` and `uvicorn`.

---

## **5️⃣ Configure FastAPI for CORS**

Update `backend/main.py`:

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Add CORS for Codespaces forwarded ports
origins = [
    "https://<YOUR_CODESPACE_NAME>-8080.app.github.dev",
    "https://<YOUR_CODESPACE_NAME>-8000.app.github.dev",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Hello from Python backend 👋"}
```

> Replace `<YOUR_CODESPACE_NAME>` with your Codespace URL prefix.

---

## **6️⃣ Run the backend (FastAPI)**

Start backend server and expose it to Codespaces:

```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

* In Codespaces, **forward port 8000** to make it accessible via browser:

```
https://<YOUR_CODESPACE_NAME>-8000.app.github.dev
```

---

## **7️⃣ Update frontend to call backend**

Edit `frontend/lib/main.dart` (or wherever HTTP calls are made):

```dart
import 'package:http/http.dart' as http;

Future<void> fetchMessage() async {
  final url = Uri.parse('https://<YOUR_CODESPACE_NAME>-8000.app.github.dev/');
  final response = await http.get(url);

  if (response.statusCode == 200) {
    print(response.body);
  } else {
    throw Exception('Failed to fetch message');
  }
}
```

* Replace `<YOUR_CODESPACE_NAME>` with the Codespace name.
* **Do not use `127.0.0.1`**, as the browser cannot access Codespace localhost.

---

## **8️⃣ Run the frontend (Flutter Web)**

Navigate to frontend folder:

```bash
cd /workspaces/gestura/frontend
flutter run -d web-server --web-port=8080
```

* Forward **port 8080** in Codespaces to access the app in browser:

```
https://<YOUR_CODESPACE_NAME>-8080.app.github.dev
```

* You should see your Flutter web app loading and fetching data from FastAPI.

---

## **9️⃣ Verify the setup**

1. Open frontend URL in browser (8080).
2. Check that the message from backend appears.
3. Open browser console (F12) → Ensure **no CORS errors**.
4. Backend logs in Codespaces terminal should show requests from the frontend.

---

## **10️⃣ Notes / Troubleshooting**

* **CORS issues:** Make sure the `allow_origins` in FastAPI matches the Codespaces forwarded ports exactly.
* **Flutter web issues:** If scripts fail to load, restart Codespace shell and run `flutter clean`:

```bash
flutter clean
flutter pub get
flutter run -d web-server --web-port=8080
```

* **Port forwarding:** Both 8080 (frontend) and 8000 (backend) must be forwarded in Codespaces.
* **Localhost inside browser does not work** in Codespaces; always use the Codespaces URLs.

---
