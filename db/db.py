import pymysql

# MySQL 서버 연결 정보
host = 'localhost'
user = 'root'
password = '0522'
database = 'amcn'

# MySQL 서버에 연결
conn = pymysql.connect(host=host, user=user, password=password, database=database)

# 커서 생성
cursor = conn.cursor()

# 삽입할 데이터
data_to_insert = [
    ('John', 'john@example.com'),
    ('Emma', 'emma@example.com'),
    ('Mike', 'mike@example.com')
]

# 데이터 삽입 쿼리
insert_query = '''
INSERT INTO new (title, news_link, news_type, original_content, date,member_id)
VALUES (%s, %s, %s, %s, %s, %s)
'''

# 쿼리 실행
cursor.executemany(insert_query, data_to_insert)

# 연결 및 트랜잭션 종료
conn.commit()
cursor.close()
conn.close()
