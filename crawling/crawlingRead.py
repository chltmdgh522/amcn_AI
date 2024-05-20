from bs4 import BeautifulSoup
import requests
import pandas as pd

# 뉴스 링크가 담긴 엑셀 파일 읽기
link_df = pd.read_excel('news_20240205.xlsx')
excel_name = 'news_detail_20240205.xlsx'

# 빈 데이터프레임 생성
Information = pd.DataFrame(columns=['number', 'title', 'information', 'link'])

# 본문 내용을 담을 리스트 초기화
information = []

for idx, row in link_df.iterrows():
    print(f"Processing {idx + 1}/{len(link_df)}: {row['link']}")  # 진행 상태 출력
    main_link = row['link']
    try:
        response = requests.get(main_link, headers={'User-Agent': 'Mozilla/5.0'}, timeout=10)  # timeout 설정
        if response.status_code == 200:
            html = response.content
            soup = BeautifulSoup(html, 'html.parser')

            # 이미지 및 이미지 설명 제거
            for img in soup.find_all('img'):
                img.decompose()
            for em in soup.find_all('em'):
                # 텍스트 내용을 검사하여 특정 키워드를 포함하는지 확인
                em_text = em.get_text().lower()  # 모든 텍스트를 소문자로 변환하여 검사
                if 'img_desc' in em.get('class', []) or '일러스트' in em_text or '기자' in em_text:
                    em.decompose()

            # 첫 번째 구조의 본문 탐색
            info_div = soup.find('div', {'id': 'newsct_article'})
            if info_div:
                info = info_div.text.strip().replace('\n', ' ')
            else:
                # 두 번째 구조의 본문 탐색
                info_div = soup.find('div', {'id': 'newsEndContents'})
                if info_div:
                    info = info_div.text.strip().replace('\n', ' ')
                    end = info.find('기사제공')
                    if end != -1:
                        info = info[:end]
                else:
                    # 본문을 찾을 수 없는 경우
                    info = ''
            information.append(info)
    except Exception as e:
        print(f"Error with URL {main_link}: {e}")
        information.append('')  # 예외 발생시 빈 문자열 추가

# 데이터프레임에 본문 내용 추가
link_df['information'] = information

# 엑셀 파일로 저장
link_df.to_excel(excel_name, sheet_name='결과값', index=False)