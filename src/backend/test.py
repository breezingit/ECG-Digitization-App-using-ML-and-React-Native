import psycopg2

conn = psycopg2.connect(database ="postgres", user = "yashpriyadarshi",
                password = "dep:1234", host = "dep.postgres.database.azure.com")

cur = conn.cursor()
# query="""SELECT * FROM JName ORDER BY ID DESC LIMIT 1;"""
# cur.execute(query)
# rows = cur.fetchall()
# Name=""
# for data in rows:
#     Name=data[1]

# query="""SELECT * FROM JImage ORDER BY ID DESC LIMIT 1;"""
# cur.execute(query)
# rows = cur.fetchall()

# Image=""
# for data in rows:
#     Image=data[1]

query = """INSERT INTO jimage(biodata) VALUES({0});""".format("0011")

# query = """INSERT INTO jimage(Name,biodata) VALUES(%s,%s);"""
# val=("0011")
# val=(Name,bytesOfImage)
cur.execute(query)
conn.commit()
conn.close()