import os
import mariadb

#   Description: wrapper class for handling calls to a mariadb database that uses the singleton pattern.
class DB:
    instance = None

    #   Description: internal class that interacts with the mariadb library to make
    #   calls to the database.
    class __db:
        #   Description: Retrieves environment variables from the os relating to db credentials
        #   and stores them in class variables.
        def __init__(self):
            self.user = os.environ.get('DB_USER', "root")
            self.password = os.environ.get('DB_PASSWORD', "")
            self.host = os.environ.get('DB_HOST', "host.docker.internal")
            self.port = int(os.environ.get('DB_PORT', 3306))
            self.database = os.environ.get('DB_DATABASE', "Database")

        #   Description: Creates a connection using the db credentials stored in the class.
        #   @return connection mariadb connection to database
        def create_connection(self):
            try:
                return mariadb.connect(
                    user=self.user,
                    password=self.password,
                    host=self.host,
                    port=self.port,
                    database=self.database
                )
            except Exception as e:
                print(e, flush=True)

        #   Description: Executes an sql query.
        #   @param query string that holds the sql query to execute
        #   @param data tuple of strings that holds values to insert into sql query
        #   @return tuple containing query results, and row count
        def execute(self, query, data=[]):
            try:
                conn = self.create_connection()
                cur = conn.cursor()

                if(not data):
                    cur.execute(query)
                else:
                    cur.execute(query, data)

                res = cur.fetchall() if cur.description else ""
                rowcount = cur.rowcount

                conn.commit()
                conn.close()

                if(res):
                    return res, rowcount
                return rowcount
            except Exception as e:
                print(f"error: {e}", flush=True)

        #   Description: Executes an sql statement multiple times for different data values.  
        #   Meant for use with insert, update, and delete statements
        #   @param query string that holds the sql query to execute
        #   @param data array of tuples in which each tuple holds values to insert into the sql query
        #   @return rowcount number of rows affected by sql statement
        def executemany(self, query, data):
            try:
                conn = self.create_connection()
                cur = conn.cursor()

                cur.executemany(query, data)
                rowcount = cur.rowcount

                conn.commit()
                conn.close()

                return rowcount
            except Exception as e:
                print(f"error: {e}", flush=True)

    #   Description: creates a new instance of thSe database handler if none exists, or returns a reference.
    def __new__(cls):
        if not DB.instance:
            DB.instance = DB.__db()
        return DB.instance