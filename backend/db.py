import os
import mariadb

class DB:
    instance = None

    class __db:
        def __init__(self):
            self.user = os.environ.get('DB_USER', "root")
            self.password = os.environ.get('DB_PASSWORD', "")
            self.host = os.environ.get('DB_HOST', "host.docker.internal")
            self.port = int(os.environ.get('DB_PORT', 3306))
            self.database = os.environ.get('DB_DATABASE', "Database")
            
        def __str__(self):
            return repr(self)

        def create_connection(self):
            try:
               return mariadb.connect(
                    user=self.user,
                    password=self.password,
                    host=self.host,
                    port=self.port,
                    database=self.database
                )
            except  Exception as e:
                print(e, flush=True)

        def execute(self, query, data=[], requestType="GET"):
            try:
                conn = self.create_connection()
                cur = conn.cursor()
                res = ""

                if(not data):
                    cur.execute(query)
                else:
                    cur.execute(query, data)

                if(requestType == "GET"):
                    res = cur.fetchall()
                
                conn.commit()
                conn.close()

                if(res):
                    return res
            except Exception as e:
                print(e, flush=True)

    def __new__(cls):
        if not DB.instance:
            DB.instance = DB.__db()
        return DB.instance