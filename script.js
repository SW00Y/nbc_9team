// 임지윤 시작

/* 내비게이션 바 스크롤 */
document.querySelectorAll('.scroll-link').forEach(link => {
    link.addEventListener('click', function (event) {
        event.preventDefault(); // 브라우저 기본 동작 방지

        const targetId = this.getAttribute('data-target');
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
            // 타겟으로 이동할 위치 계산
            const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY;

            // 내비게이션 바의 높이 가져오기
            const navbarHeight = document.querySelector('.navbar').offsetHeight;
            window.scrollTo({
                top: targetPosition - navbarHeight, // 내비게이션 바의 높이만큼 스크롤 위치를 수정
                behavior: 'smooth'
            });
        }
    });
});
/* 내비게이션 바 스크롤 끝 */

// 임지윤 끝

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