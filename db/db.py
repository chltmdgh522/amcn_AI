import pymysql
import pandas as pd
import numpy as np  # NaN 값을 확인하기 위해 numpy 모듈을 추가
from enum import Enum

class NewsType(Enum):
    IT = 'IT'
    SPORTS = '스포츠'
    SCIECNE = '과학'
    GAME = '게임'
    # 다른 카테고리들도 추가하십시오.

def map_category_to_enum(category):
    if category == 'IT':
        return NewsType.IT
    elif category == '스포츠':
        return NewsType.SPORTS
    elif category == '과학':
        return NewsType.SCIECNE
    elif category == '게임':
        return NewsType.GAME
    # 다른 카테고리들에 대한 매핑도 추가하십시오.

# MySQL 서버 연결 정보
host = 'localhost'
user = 'root'
password = '0522'
database = 'amcn'

# MySQL 서버에 연결
conn = pymysql.connect(host=host, user=user, password=password, database=database)

# 커서 생성
cursor = conn.cursor()

# 엑셀 파일 경로 설정
excel_file = 'C:/Users/chltm/PycharmProjects/amcn_AI/crawling/news_detail_20240205.xlsx'

# 엑셀 파일 읽어오기
df = pd.read_excel(excel_file)

# 데이터 삽입 쿼리
insert_query = '''
INSERT INTO news (title, news_link, news_type, original_content, date,member_id)
VALUES (%s, %s, %s, %s, %s, %s)
'''

# 쿼리 실행
for index, row in df.iterrows():
    # NaN 값이 아닌 경우에만 데이터 삽입
    if not pd.isna(row['title']) and not pd.isna(row['link']) and not pd.isna(row['category']) and not pd.isna(row['information']):
        news_type = map_category_to_enum(row['category']).value
        data_to_insert = (row['title'], row['link'], news_type, row['information'], "2024.02.05",
                          "56671cb5-c4c7-4cdc-a31c-d336bf79406b")
        cursor.execute(insert_query, data_to_insert)

# 연결 및 트랜잭션 종료
conn.commit()
cursor.close()
conn.close()
