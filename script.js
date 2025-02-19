// 임지윤 시작

/* 스크롤 이동 기능 시작 */
document.querySelectorAll('.scroll-link').forEach(link => {
    link.addEventListener('click', function (event) {
        event.preventDefault(); // 브라우저 기본 동작 방지

        const scrollContainer = document.querySelector('.scroll-container');
        const targetId = this.getAttribute('data-target');
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
            // 스크롤 스냅 기능 임시 비활성화 (기능 간 충돌 방지)
            scrollContainer.style.scrollSnapType = 'none';

            // 타겟으로 이동할 위치 계산
            const targetPosition = targetElement.getBoundingClientRect().top + scrollContainer.scrollTop;

            scrollContainer.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });

            // 스크롤이 끝난 후 스냅 기능 복구
            setTimeout(() => {
                scrollContainer.style.scrollSnapType = 'y mandatory';
            }, 1000); // 1초 후 복구 (애니메이션 완료 후)
        }
    });
});
/* 스크롤 이동 기능 끝 */

// 임지윤 끝




/**************************************
 성우영 member card div 시작
 **************************************/


 $(document).ready(function () {
    let member_list = [
        { name: "이귀현", img: "./static/img/1.jpg", site: "./static/page/1/LKH.html" },
        { name: "조효준", img: "./static/img/2.jpg", site: "2" },
        { name: "이소미", img: "./static/img/3.png", site: "./static/page/3/isomindex.html" },
        { name: "임지윤", img: "./static/img/4.png", site: "./static/page/4/IJY.html" },
        { name: "성우영", img: "./static/img/5.jpg", site: "https://swy.kro.kr" }
    ];

    let member_div = $(".member-div");

    $.each(member_list, function (idx, member) {
        let card_div = `
                        <div class="col" id=${idx}" onclick="window.open('${member.site}')")>
                            <div class="card on-pointer">
                                <div class="card-img-div">
                                    <img src="${member.img}" class="card-img-top">
                                </div>
                                <div class="card-body">
                                    <h5 class="card-title">${member.name}</h5>
                                </div>
                            </div>
                        </div>
                    `;
        member_div.append(card_div);
    });
});


/**************************************
성우영 member card div 종료
**************************************/











//조효준 스크립트 시작
let db;

// IndexedDB 연결 함수
const openDb = () => {
    const request = indexedDB.open('GuestBookDB', 1);

    request.onupgradeneeded = (event) => {
        db = event.target.result;
        if (!db.objectStoreNames.contains('messages')) {
            db.createObjectStore('messages', { keyPath: 'id' });
        }
    };

    request.onsuccess = (event) => {
        db = event.target.result;
        console.log("Database opened successfully.");
        loadMessages(); // DB가 완전히 열린 후에 실행
    };

    request.onerror = (event) => {
        console.error("Database error:", event.target.errorCode);
    };
};

const loadMessages = () => {
    if (!db) {
        console.error("Database is not initialized yet.");
        return;
    }

    const transaction = db.transaction('messages', 'readonly');
    const store = transaction.objectStore('messages');
    const cursorRequest = store.openCursor();

    const messagesList = document.getElementById('guestMessages');

    if (messagesList.children.length > 0) {
        console.log("Messages are already loaded.");
        return; // 메시지가 이미 로드되었으면 중복 로딩 방지
    }
    messagesList.innerHTML = "";

    cursorRequest.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
            // 커서의 값을 별도의 변수에 저장
            const { id, name, message } = cursor.value;

            // 메시지 박스 추가
            const messageBox = document.createElement('div');
            messageBox.className = 'message-box';

            // 메시지 리스트 아이템 추가
            const listItem = document.createElement('div');
            listItem.setAttribute('data-id', id);

            // 별도의 요소를 사용하면 텍스트와 버튼을 구분하기 쉽습니다.
            const textSpan = document.createElement('span');
            textSpan.textContent = `${name}: ${message}`;
            listItem.appendChild(textSpan);

            // 수정 버튼과 삭제 버튼을 감싸는 div 추가
            const buttonGroup = document.createElement('div');
            buttonGroup.className = 'button-group';

            // 수정 버튼 생성
            const editButton = document.createElement('button');
            editButton.className = 'edit-btn';
            editButton.textContent = '수정';
            // 이벤트 핸들러에서 별도의 변수 사용
            editButton.onclick = () => editMessage(id, name, message);
            listItem.appendChild(editButton);

            // 삭제 버튼 생성
            const deleteButton = document.createElement('button');
            deleteButton.className = 'delete-btn';
            deleteButton.textContent = '삭제';
            deleteButton.onclick = () => deleteMessage(id);
            listItem.appendChild(deleteButton);

            // 버튼 그룹을 리스트 아이템에 추가
            listItem.appendChild(buttonGroup);

            //이번 메세지 부분
            messageBox.appendChild(listItem);

            messagesList.appendChild(messageBox);

            cursor.continue();
        }
    };

    // 방명록 메시지 추가 (기존 데이터 덮어쓰지 않도록 add 사용)
    const addMessage = (name, message) => {
        if (!db) {
            console.error("Database not initialized.");
            return;
        }

        const transaction = db.transaction('messages', 'readwrite');
        const store = transaction.objectStore('messages');

        const newEntry = { id: Date.now(), name, message };

        const request = store.add(newEntry);

        request.onsuccess = () => {
            window.location.reload();
        };

        request.onerror = (event) => {
            console.error("Error adding message:", event.target.error);
        };
    };

    const editMessage = (id, currentName, currentMessage) => {
        const newName = prompt("이름을 수정하세요", currentName);
        const newMessage = prompt("내용을 수정하세요", currentMessage);

        if (newName && newMessage) {
            const transaction = db.transaction('messages', 'readwrite');
            const store = transaction.objectStore('messages');

            store.get(id).onsuccess = (event) => {
                const existingMessage = event.target.result;
                if (existingMessage) {
                    existingMessage.name = newName;
                    existingMessage.message = newMessage;

                    store.put(existingMessage); // 기존 ID 유지한 채로 수정
                    transaction.oncomplete = () => {
                        // 수정된 메시지만 화면에서 업데이트
                        const messageBox = document.querySelector(`[data-id="${id}"]`);
                        if (messageBox) {
                            const textSpan = messageBox.querySelector('span');
                            textSpan.textContent = `${newName}: ${newMessage}`;
                        }
                        window.location.reload();
                    };
                }
            };
        }
    };

    // 방명록 메시지 삭제 (id 기준으로 정확한 데이터 삭제)
    const deleteMessage = (id) => {
        const transaction = db.transaction('messages', 'readwrite');
        const store = transaction.objectStore('messages');
        store.delete(id);

        transaction.oncomplete = () => {
            // 데이터베이스에서 삭제가 완료되면 페이지 새로고침
            window.location.reload()
        };
    };

    // 폼 제출 처리
    document.getElementById('guestBookForm').addEventListener('submit', (event) => {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const message = document.getElementById('message').value;

        addMessage(name, message);

        document.getElementById('name').value = '';
        document.getElementById('message').value = '';
    });
}
// DB 열기
openDb();

//조효준 스크립트끝
