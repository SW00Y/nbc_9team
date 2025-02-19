/* 내비게이션 바 스크롤 시작 */
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