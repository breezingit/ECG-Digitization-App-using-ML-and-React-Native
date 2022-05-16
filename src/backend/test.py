import psycopg2

# data=request.get_json()

data={}
data["count"]=1

conn = psycopg2.connect(database ="postgres", user = "yashpriyadarshi",
                    password = "dep:1234", host = "dep.postgres.database.azure.com")
    
cur = conn.cursor()

query="SELECT biodata from JImage ORDER BY ID DESC LIMIT 1 OFFSET " + str(data["count"])

cur.execute(query)
rows = cur.fetchall()

img_str=""
for data in rows:
    img_str=data[0]
    break

print(img_str)
