from flask import Flask, jsonify
import json
from flask_cors import CORS
import requests
from collections import defaultdict
from datetime import datetime

app = Flask(__name__)
CORS(app)

@app.route('/status_report')
def status_report():
    try:
        # Dummy data to use in case of API token expiration
        dummy_data = json.loads("""
        {
            "user": {
                "id": 110,
                "f_name": "Sreejith",
                "l_name": "",
                "phone": "9496362717",
                "email": "sreejith.k@benzyinfotech.com",
                "created_at": "2022-06-01T16:39:47.000000Z",
                "updated_at": "2022-10-20T05:52:40.000000Z",
                "status": 1,
                "order_count": 0,
                "emp_id": "BI00526",
                "department_id": 1,
                "is_veg": 0,
                "is_sat_opted": 0
            },
            "reports": [
                {"date": "2022-10-01", "opt_ins": {"breakfast": "Canceled", "lunch": "Canceled", "dinner": "Canceled"}},
                {"date": "2022-10-02", "opt_ins": []},
                {"date": "2022-10-03", "opt_ins": {"breakfast": "Canceled", "lunch": "Delivered", "dinner": "Delivered"}},
                {"date": "2022-10-04", "opt_ins": {"breakfast": "Canceled", "lunch": "Delivered", "dinner": "Canceled"}},
                {"date": "2022-10-05", "opt_ins": {"breakfast": "Canceled", "lunch": "Canceled", "dinner": "Canceled"}},
                {"date": "2022-10-06", "opt_ins": {"breakfast": "Canceled", "lunch": "Pending", "dinner": "Pending"}},
                {"date": "2022-10-22", "opt_ins": []},
                {"date": "2022-10-23", "opt_ins": []},
                {"date": "2022-10-28", "opt_ins": []},
                {"date": "2022-10-29", "opt_ins": []},
                {"date": "2022-10-30", "opt_ins": []}
            ]
        }
        """)

        remote_api_url = 'http://canteen.benzyinfotech.com/api/v3/customer/report'

        #TOKEN WAS EXPIRED
        auth_token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiZWRhNWExODU0OTFhYWE0MmY5YzMyZjRhMTU5MDM1ODk4ZjZiMzMxNWUzZjJjNGRiZDA1N2IyNGE3NTAzMDc3NDBlMjFlYjZmNGE4Mjk0MGUiLCJpYXQiOjE3MDQ4MDA4OTAuODc5OTI1OTY2MjYyODE3MzgyODEyNSwibmJmIjoxNzA0ODAwODkwLjg3OTkyOTA2NTcwNDM0NTcwMzEyNSwiZXhwIjoxNzM2NDIzMjkwLjgzNDkxMjA2MTY5MTI4NDE3OTY4NzUsInN1YiI6IjI2NSIsInNjb3BlcyI6W119.CwDEjlHoRtOXdFcaO6KGGxV202AOA7MMtJVPtKzgLqzTFzUUnDLGBd7PNAtHO2--3YOathM9HOG8hYjY8wjktXZIoCGUR9GWIaEVUxLwFq927CrSf05NuqTBTrJcDeBOjXDvKcSBiJ2A994FC2IunPcdkaZ4jpoaWBIaWueYUbHviYSQuLec3tFcAMg4njrImAlaN9kQKkHetpdrdbUEX1Wzq4X1QwuOx7W3W2nbbxaoNgFX1gaabxi00ZO7h5MokGvtqy_gCkS9TYoM74VfxmTyAAczjttLcPqDNiAL_ZJdutDMezw32CZj8G8l8PUL46F_BuaxatZDBUZxeClZh4_0Wvo9GX4zqF2XvHdzZHnwdB414vNCl8itaGW9w7QWbdchPOglhnek32ZmkH0MIqeOBhnAyHo5_WbP0uLd_3qmz3w04nvTbTGV25-QebaxPAsVD0-7Za1sVpqB_FD6yEeliaEzdxl_8gA5IH59uowpfPYgUIjom8NVEASuYsAwb0q3f0jhNRfwg2zmXNenoDunh_dN9l2NRjI2gdZueSMwu6IJLQK46jpn01uG2iQ1xxpFJAGe_bzSceLsho3dbtabym3tMqi0Ac02xUP9Mn50LdkFJGNVU9jiuHQfyjQirDtGUfya3aIvpJlCGx9Cx99s_4P89uDnOiXy3A1Q"
        params = {"month": 11}
        
        headers = {
            'Authorization': f'Bearer {auth_token}',
            'Content-Type': 'application/json'
        }

        response = requests.post(remote_api_url, headers=headers, json=params)
        response_data = response.json()
        
        #IF NO DATA FOUND IN HTTP REQUEST USE DUMMY DATA
        if 'errors' in response_data and len(response_data["errors"]) > 0:
            print("Using dummy data due to API errors.")
            data = dummy_data
        else:
            data = response_data

        daily_status = []
        monthly_fines = defaultdict(lambda: {'fine': 0, 'year': 0, 'month': 0})
        total_fine = 0

        for day in data['reports']:
            date = datetime.strptime(day['date'], '%Y-%m-%d')
            year_month_key = (date.year, date.month)
            day_status = {
                'date': day['date'],
                'breakfast': 'Not Ordered',
                'lunch': 'Not Ordered',
                'dinner': 'Not Ordered',
                'fine': 0
            }

            if isinstance(day['opt_ins'], list) and len(day['opt_ins']) == 0:
                day_status['breakfast'] = 'Not Ordered'
                day_status['lunch'] = 'Not Ordered'
                day_status['dinner'] = 'Not Ordered'

            elif isinstance(day['opt_ins'], dict):
                day_status['breakfast'] = day['opt_ins'].get('breakfast', 'Not Ordered')
                day_status['lunch'] = day['opt_ins'].get('lunch', 'Not Ordered')
                day_status['dinner'] = day['opt_ins'].get('dinner', 'Not Ordered')

            if day_status['breakfast'] == 'Pending':
                day_status['fine'] += 100
            if day_status['lunch'] == 'Pending':
                day_status['fine'] += 100
            if day_status['dinner'] == 'Pending':
                day_status['fine'] += 100

            total_fine += day_status['fine']
            daily_status.append(day_status)

            monthly_fines[year_month_key]['fine'] += day_status['fine']
            monthly_fines[year_month_key]['year'] = date.year
            monthly_fines[year_month_key]['month'] = date.month
        
        monthly_fines_list = list(monthly_fines.values())

        return jsonify({
            "daily_status": daily_status,
            "total_fine": total_fine,
            "user_data": data.get("user"),
            "monthly_fines": monthly_fines_list
        })

    except Exception as e:
        print(f"An error occurred: {e}")
        return jsonify({"user": {}, "reports": []})

if __name__ == '__main__':
    app.run(debug=True)
