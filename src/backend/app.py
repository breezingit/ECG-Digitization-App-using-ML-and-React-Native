from flask import Flask, Response, request, jsonify
from Scanner import getScanned 
import base64
from io import BytesIO
from PIL import Image
import psycopg2
import json
from otp import *

app = Flask(__name__)

@app.route("/image", methods=['GET', 'POST'])
def image():
    if(request.method == "POST"):
        bytesOfImage = request.get_data()  
        conn = psycopg2.connect(database ="postgres", user = "yashpriyadarshi",
                        password = "dep:1234", host = "dep.postgres.database.azure.com")
        
        cur = conn.cursor()

        query = """INSERT INTO JImage(Name,biodata) VALUES(%s,%s);"""
        val=("Name",bytesOfImage)
        cur.execute(query,val)
        conn.commit()
        conn.close()

        return "Image read"
    

@app.route("/final", methods=["GET"])
def final():

    conn = psycopg2.connect(database ="postgres", user = "yashpriyadarshi",
                        password = "dep:1234", host = "dep.postgres.database.azure.com")
        
    cur = conn.cursor()
    query="""SELECT biodata FROM JImage ORDER BY ID DESC LIMIT 1;"""
    cur.execute(query)
    rows = cur.fetchall()
    
    imageData=""
    for data in rows:
        imageData=data[0]
        
    
    
    image=getScanned(imageData)
    buffered = BytesIO()
    image.save(buffered, format="JPEG")
    img_str = base64.b64encode(buffered.getvalue())
    
    
    query = """INSERT INTO JImage(Name,biodata) VALUES(%s,%s);"""
    val=("Name",img_str)
    cur.execute(query,val)
    conn.commit()
    conn.close()
    
    return img_str

@app.route("/savename",methods=["POST"])
def savename():
    
    data =request.get_data()
    output = data.decode()
    res = json.loads(output)

    conn = psycopg2.connect(database ="postgres", user = "yashpriyadarshi",
                        password = "dep:1234", host = "dep.postgres.database.azure.com")
        
    cur = conn.cursor()
    query="""SELECT biodata FROM JImage ORDER BY ID DESC LIMIT 1;"""
    cur.execute(query)
    rows = cur.fetchall()
    
    imageData=""
    for data in rows:
        imageData=data[0]
        
    query = """INSERT INTO Images(Name,biodata) VALUES(%s,%s);"""
    val=(res["searchPhrase"], imageData)
    cur.execute(query,val)
    conn.commit()
    conn.close()
    
    return "Name Inserted"

@app.route("/getdata", methods=["GET"])
def getData():
    conn = psycopg2.connect(database ="postgres", user = "yashpriyadarshi",
                        password = "dep:1234", host = "dep.postgres.database.azure.com")
        
    cur = conn.cursor()
    query="""SELECT Name FROM Images;"""
    cur.execute(query)
    rows = cur.fetchall()
    
    
    nameList={}
    count=0
    for data in rows:
        nameList[count]=data[0]
        count+=1
 
    return nameList
    
@app.route("/signin", methods=["POST"])
def signin():
    data =request.get_json()
    print(data["data"]["email"])
    
    conn = psycopg2.connect(database ="postgres", user = "yashpriyadarshi",
                        password = "dep:1234", host = "dep.postgres.database.azure.com")
        
    cur = conn.cursor()
    query="""SELECT Email, Name FROM Users;"""
    cur.execute(query)
    rows = cur.fetchall()
    
    found=False
    personName=""
    for datas in rows:
        if datas[0]==data["data"]["email"]:
            found=True
            personName=datas[1]
            break
        
    if found==True:
        otp=generateOTP()
        sendOTP(data["data"]["email"], otp)
        dict={"otp": otp, "name": personName}
        return dict
    else:
        return "NO"
    
# @app.route("/cancelimage", methods="POST")
# def cancelimage():
#     conn = psycopg2.connect(database ="postgres", user = "yashpriyadarshi",
#                         password = "dep:1234", host = "dep.postgres.database.azure.com")
        
#     cur = conn.cursor()
#     query="""delete from Images order by id desc limit 1"""
#     cur.execute(query)
#     conn.commit()
#     conn.close()

if __name__ == '__main__':
      app.run(host='172.22.15.128',port='5000')

# psql -h dep.postgres.database.azure.com -d postgres -U yashpriyadarshi (pass: dep:1234)

# CREATE TABLE JImage(
#     ID SERIAL PRIMARY KEY,
#     NAME TEXT,
#     biodata bytea
# );

# CREATE TABLE Users(
#     ID SERIAL PRIMARY KEY,
#     NAME TEXT,
#     EMAIL TEXT
# );
# INSERT INTO USERS(Name, Email) VALUES('Yash','yashpriyadarshi465@gmail.com');
# biodata bytea

