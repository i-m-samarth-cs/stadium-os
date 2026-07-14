import httpx
import json

api_key = "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"
url = "https://integrate.api.nvidia.com/v1/chat/completions"

headers = {
    "Authorization": f"Bearer {api_key}",
    "Content-Type": "application/json"
}
payload = {
    "model": "meta/llama3-70b-instruct",
    "messages": [{"role": "user", "content": "Hello!"}],
    "max_tokens": 50
}

try:
    response = httpx.post(url, headers=headers, json=payload)
    print(response.status_code)
    print(response.text)
except Exception as e:
    print(str(e))
