import pandas as pd
from selenium import webdriver
import time
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options

# 브라우저 꺼짐 방지 옵션
chrome_options = Options()
chrome_options.add_experimental_option("detach", True)

driver = webdriver.Chrome(options=chrome_options)

# 스크랩하고 싶은 날짜
date = '20240205'

# 과학(230)과 게임(229) 분야의 sid2 값
categories = {'과학': 230, '게임': 229}

# 기사 정보를 저장할 데이터프레임
Main_link = pd.DataFrame({'number': [], 'title': [], 'link': [], 'category': []})

for category, sid2 in categories.items():
    link = f'https://news.naver.com/main/list.naver?mode=LS2D&sid2={sid2}&sid1=105&mid=shm&date={date}'
    driver.get(link)
    time.sleep(3)

    try:
        more_button = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CLASS_NAME, 'section_more_inner._CONTENT_LIST_LOAD_MORE_BUTTON'))
        )
        while True:
            more_button.click()
            time.sleep(3)
    except Exception as e:
        print(f"Error finding or clicking more_button: {e}")

    articles = driver.find_elements(By.CLASS_NAME, 'sa_text_title')

    for i, article in enumerate(articles):
        title = article.text.strip()
        link = article.get_attribute('href')
        Main_link.loc[len(Main_link)] = [i + 1, title, link, category]

# 엑셀 파일 이름에 날짜를 포함시켜 구분
excel_name = f'news_{date}.xlsx'

# 크롤링한 데이터를 엑셀 파일에 저장
Main_link.to_excel(excel_name, sheet_name='링크', index=False)

