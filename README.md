# 📔 서비스 소개

![pogakco-overview](https://github.com/user-attachments/assets/712bd8af-a9a3-4b4d-9650-b4e6e00feb04)

- **🌐 배포 URL :** https://pogakco.site
- **🗓️ 전체 프로젝트 기간 :** 2024-6-24 ~ 2024-7-19

 <br>

> **더 집중하고 싶으신가요?** 공유 타이머로 함께 공부하는 서비스, **POGAKCO(뽀각코)** 를 만나보세요!<br>

POGAKCO는 **같은 타이머(=뽀모도로)** 를 통해 학습 사이클을 공유하고 생산성을 극대화할 수 있는 협업 서비스입니다. 👥 <br> 
자신만의 학습 스타일에 맞게 **집중 시간, 쉬는 시간, 큰 휴식 시간,** 그리고 **뽀모도로 사이클 횟수**를 설정하여 타이머를 생성해보세요! <br> 

- 설정된 타이머는 **다른 사용자와 실시간으로 공유**되며, 함께 목표를 달성하는 즐거움을 느낄 수 있습니다.
- **뽀모도로 사이클 수**로 경쟁하세요!
- **함께하면 더 집중**할 수 있고, **효율적인 학습 환경**을 조성할 수 있는 POGAKCO로 여러분의 **집중력**을 높여보세요! 🚀

<br>

## 🍅 뽀모도로 공부법이란?

> 뽀모도로 공부법은 이탈리아의 프란체스코 시릴로(Francesco Cirillo)가 1980년대에 개발한 시간 관리 기법입니다.
> '뽀모도로'는 이탈리아어로 '토마토'를 뜻하며, 시릴로가 토마토 모양의 타이머를 사용한 데서 유래되었습니다.
> 이 기법은 일정 시간 동안 집중하여 일을 한 후, 짧은 휴식을 취하는 과정을 반복함으로써 집중력과 생산성을 극대화하는 방법입니다.

### :alarm_clock: 기본 원리

1. 집중 시간 설정 : 이 시간동안 작업에 집중합니다
2. 짧은 휴식 설정 : 집중 시간이 끝나면 짧은 휴식을 취합니다
3. 반복 횟수 설정 : 위 1, 2번 과정을 정한 횟수만큼 반복합니다.
4. 긴 휴식 설정 : 반복이 끝나면 긴 휴식을 취합니다.

### 👍🏻 장점

- 향상된 집중력 : 일정 시간동안 작업에만 집중하도록 하여 산만함을 줄입니다!
- 효율적인 시간 관리 : 짧은 작업과 휴식 주기로 시간 관리가 쉬워집니다!
- 스트레스 감소 : 짧은 휴식을 통해 피로를 줄이고, 스트레스를 완화합니다!
- 목표 달성 : 구체적인 시간 설정과 반복을 통해 목표를 체계적으로 달성할 수 있습니다!

<br>



# ⚙️ 개발 환경 및 작업 관리

## 🛠️ 프로젝트 아키텍처

![프로젝트 아키텍처](https://github.com/user-attachments/assets/a8717165-6e9d-4ff4-8098-15efa06e14f1)

<img src="https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=black"><img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=TypeScript&logoColor=white">
<br>
<img src="https://img.shields.io/badge/socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white">
<img src="https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white">
<img src="https://img.shields.io/badge/mysql-4479A1?style=for-the-badge&logo=mysql&logoColor=white">
<img src="https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black">
<br>
<img src="https://img.shields.io/badge/aws-232F3E?style=for-the-badge&logo=amazonaws&logoColor=white"/>
<img src="https://img.shields.io/badge/notion-000000?style=for-the-badge&logo=notion&logoColor=white"/>
<img src="https://img.shields.io/badge/slack-4A154B?style=for-the-badge&logo=slack&logoColor=white"/>
<img src="https://img.shields.io/badge/github-181717?style=for-the-badge&logo=github&logoColor=white">

<br>
<br>

# 📃 페이지별 기능
## 📌 메인페이지
![main](https://github.com/user-attachments/assets/ae7c66a9-916b-4c64-839d-7b6b2a4e1778)

- 메인 페이지에서는 방 전체 목록과 참여한 방 목록을 볼 수 있습니다.
- 사이클이 진행 중인 방에는 참여할 수 없으므로 휴식 중인 방을 따로 필터링할 수 있도록 구현하였습니다.
- 참여한 방은 로그인한 유저만 접근 가능합니다.

<br>

### ✔️ 회원가입
![signup](https://github.com/user-attachments/assets/31dca3bd-78d3-48da-86b0-77fad07e59a4)

- 메인 페이지 상단의 로그인 버튼을 통해 로그인 페이지로 이동할 수 있고, 로그인 버튼 하위의 회원가입 링크를 통해 회원가입 페이지로 이동합니다. 
- 회원 가입 시 닉네임과 이메일, 비밀번호를 입력하면 입력창에서 바로 유효성 검사가 진행되고 통과하지 못한 경우 각 경고 문구가 입력창 하단에 표시됩니다.
  - 각 필드는 빈 값이면 안 됩니다.
  - 닉네임의 경우 숫자, 영어, 완성형 한글(가-힣)만 포함될 수 있으며 2~10자 내의 값이어야 합니다.
  - 비밀번호의 경우 알파벳, 숫자, 특수문자가 1개씩 포함되는 8~20자 내의 값이어야 합니다.
  - 이메일의 경우 이메일 형식이어야 합니다. 
- 닉네임과 이메일의 경우 중복 확인 과정을 거쳐야 하며, 중복될 경우 각 입력창 하단에 경구 문구가 나타납니다.
- 작성이 완료된 후, 유효성 검사가 통과되면 회원가입에 성공하고, 로그인 페이지로 이동합니다.

<br>

### ✔️ 로그인
![login](https://github.com/user-attachments/assets/b84677ef-5a0f-493e-89c2-337c8c8426ca)

- 이메일 또는 비밀번호가 틀릴 경우 경고 문구가 나타납니다.

<br>

### ✔️ 마이페이지
![mypage](https://github.com/user-attachments/assets/ce27a88d-afff-4f6c-badb-c2eb01fa0c48)

- 로그인 한 유저만 진입할 수 있습니다.
- 마이페이지로 이동하기 전 비밀번호 확인 페이지를 통해 비밀번호 확인 과정을 거칩니다.
  - 비밀번호가 틀릴 경우 경고 에러 메시지가 나타납니다.
- 마이페이지에서 프로필을 수정할 수 있습니다.
  - 프로필 사진은 등록하지 않을 경우 기본 이미지가 등록됩니다.
  - 5MB 이하 크기의 프로필 이미지를 설정할 수 있습니다.
  - 닉네임을 수정할 수 있습니다. 단, 중복되지 않은 닉네임이어야 합니다.
  - 이메일은 수정 불가능합니다.
- 비밀번호를 수정하고 싶은 경우 비밀번호 입력란과 비밀번호 확인 입력란에 수정하고 싶은 비밀번호를 입력하면 됩니다.
  - 비밀번호 수정을 원치 않을 경우 해당 칸에 값을 입력하지 않으면 됩니다.
- 이후 프로필 수정하기 버튼을 누르면 프로필이 수정됩니다.

<br>

### ✔️ 로그아웃
![logout](https://github.com/user-attachments/assets/a8e31d6f-24a2-4b59-9f09-ca1b56a21a6d)

- 오른쪽 상단의 로그아웃 버튼을 누르면 로그아웃 확인창이 뜹니다.
- "예" 버튼을 누를 경우 로그아웃 성공 메시지가 뜨며 로그인 페이지로 이동합니다.

<br>

## 📌 방 관련 페이지
### ✔️ 방 생성하기
![createRoom](https://github.com/user-attachments/assets/4b9be121-5a45-4119-a4bd-10fb1e891897)

- 오른쪽 하단 플로팅 버튼을 누르면 방을 생성할 수 있습니다. 
- 방 정보를 작성해야 합니다. 
  - 각 필드(방 제목, 방 소개, 수용 인원)는 필수 값입니다.
  - 각 필드의 유효성 검사를 통과하지 못하면 경고 문구가 입력창 하단에 표시됩니다.
- 타이머 정보를 작성해야 합니다.
  - 기본값이 세팅되어 있으며 각자의 스타일에 맞게 수정할 수 있습니다.
  - 각 필드(집중 시간, 휴식 시간, 대 휴식 시간, 뽀모도로 사이클 수)는 필수 값입니다.
  - 각 필드의 유효성 검사를 통과하지 못하면 경고 문구가 입력창 하단에 표시됩니다.
- 필드의 유효성 검사를 모두 통과하면 하단의 생성하기 버튼을 클릭해 방을 생성할 수 있으며, 생성한 방의 방장이 됩니다.
- 방 생성이 완료되면 생성한 방에 입장하게 되며, 방 디테일 페이지로 이동합니다.

<br>

### ✔️ 방 참여하기와 방 관전하기 

![joinRoom](https://github.com/user-attachments/assets/773589d4-bd02-4bf5-9ab1-bf17cfc19778)

- 방을 클릭하면 방의 상세 설명을 볼 수 있습니다.
  - 로그인 한 경우 관전하기 버튼과 참가하기 버튼이 표시됩니다.
  - 집중 중인 방 혹은 방의 정원이 다 찬 경우에는 방에 참가할 수 없고 관전하기만 가능합니다.

![timer](https://github.com/user-attachments/assets/674fdb0d-78c5-4215-a94f-e9ee7513dd3a)

- 참가하기 버튼을 누르면 방 디테일 페이지로 이동합니다.
  - 왼쪽의 탭을 이용해 방 정보와 참여한 유저를 볼 수 있습니다
  - 왼쪽 상단의 관전 모드 표시를 통해 관전 모드인지 참여 모드인지 구분이 가능합니다
  - 오른쪽 상단의 알람 버튼을 통해 알람 기능을 켜고 끌 수 있습니다
  - 오른쪽 하단의 버튼을 누르면 방 삭제하기, 그룹 나가기, 방 둘러보기 버튼이 표시됩니다.
    - 방 삭제하기 : 방장만 가능하며, 사이클이 진행되는 동안에는 삭제할 수 없습니다.
    - 그룹 나가기 : 그룹을 완전 떠날 수 있습니다.
    - 방 둘러보기 : 해당 사이클을 종료하고, 방 목록 페이지로 이동합니다.

![infoAndRanking](https://github.com/user-attachments/assets/8f695701-d079-40f7-a972-70bc7f0065b4)

- 탭을 통해 방 사이클 진행 여부와 방에 대한 정보를 볼 수 있습니다.
- 참여중인 유저 목록을 통해 현재 방에 참여한 유저를 볼 수 있습니다.
  - 현재 사이클에 참여중인 유저는 상단에 위치하며 🔥 이모지가 표시됩니다.
  - 참여 중이지 않은 유저는 하단에 위치합니다.
  - 뽀모도로 사이클의 수에 따라 정렬되어 나타납니다.

### ✔️ 타이머
![timerUI](https://github.com/user-attachments/assets/2555ab79-db3f-4eff-bbda-2accc30ba362)

- 집중시간과 휴식 시간에 따라 다른 타이머 ui를 제공하여 사용자의 편의를 높였습니다.


# 👥 팀원 구성
### ✨ BE
|         **김은채**          |         **임한비**          |
|:--------------------------:|:--------------------------:|
| [<img src="https://avatars.githubusercontent.com/u/123533586?v=4" height=150 width=150> <br/> @lucaseunchae](https://github.com/lucaseunchae) | [<img src="https://avatars.githubusercontent.com/u/80617446?v=4" height=150 width=150> <br/> @hanbirang](https://github.com/hanbirang) |


### ✨ FE

|         **이창우**          |         **하주영**          |
|:--------------------------:|:--------------------------:|
| [<img src="https://avatars.githubusercontent.com/u/50562562?v=4" height=150 width=150> <br/> @changchangwoo](https://github.com/changchangwoo) | [<img src="https://avatars.githubusercontent.com/u/92720304?v=4" height=150 width=150> <br/> @hazzuu123](https://github.com/hazzuu123) |
