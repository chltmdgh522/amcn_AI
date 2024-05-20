import torch
from transformers import PreTrainedTokenizerFast, BartForConditionalGeneration, BartModel

tokenizer = PreTrainedTokenizerFast.from_pretrained('digit82/kobart-summarization')
model = BartForConditionalGeneration.from_pretrained('digit82/kobart-summarization')



text = """
 코로나19(신종 코로나 바이러스 감염증) 3차 대유행의 확산세가 거세지고 있다. 16일 신규 확진자 수는 또다시 1000명 선을 넘었다. 지난 13일 1030명 이후 사흘만에 1000명대로 올라선 것이다. 지난 1월20일 국내 첫 코로나19 확진자 발생 이후 최다 기록도 경신됐다. 신규 확진자가 연일 증가하자 최근 한 주간 일평균 지역발생 확진자 수는 처음으로 '사회적 거리두기 3단계 범위'에 들어왔다. 3단계 범위는 전국 800~1000명 이상 또는 더블링 등 급격한 증가시에 해당된다.

정부는 단기간에 확진자 수가 하루 1200명대까지 늘어날 수도 있을 전망하고, 거리두기 3단계 격상을 포함한 다양한 대책을 마련 중이다.




중앙방역대책본부는 이날 0시 기준 코로나19 신규 확진자가 1078명 늘어 누적 4만5442명임을 전했다. 지난 15일(880)명보다 198명 증가한 수치다. 신규 확진자의 감염경로를 보면 지역발생이 1천54명, 해외유입이 24명이다. 지역발생 확진자는 지난 15일(848명)보다 206명 늘었다.

확진자가 나온 지역을 보면 서울 373명, 경기 320명, 인천 64명 등 수도권이 757명이다. 수도권 이외 지역에서는 전북이 75명으로 가장 많고 이어 부산 41명, 충남 35명, 경북 28명, 대구 27명, 충북 22명, 경남 19명, 대전·제주 각 15명, 강원 8명, 울산 6명, 전남 4명, 광주 2명이다.

사망자는 지난 15일보다 12명이 증가해 누적 612명으로 집계됐다. 국내 평균 치명률은 1.35%다. 상태가 악화한 위중증 환자는 지난 15일보다 21명 늘어난 226명이다. """
text = text.replace('\n', ' ')

raw_input_ids = tokenizer.encode(text)
input_ids = [tokenizer.bos_token_id] + raw_input_ids + [tokenizer.eos_token_id]

summary_ids = model.generate(torch.tensor([input_ids]),  num_beams=4,  max_length=512,  eos_token_id=1)
decode = tokenizer.decode(summary_ids.squeeze().tolist(), skip_special_tokens=True)
print(decode)