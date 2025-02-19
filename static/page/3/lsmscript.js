// 
document.addEventListener("DOMContentLoaded", function () {
    console.log("페이지가 로드되었습니다.");
});

// 스크롤시 색상변경경
document.addEventListener("DOMContentLoaded", function () {
    const sections = document.querySelectorAll(".list"); // 각 섹션 가져오기
    const menuLinks = document.querySelectorAll(".menu ul li a");

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const sectionIndex = Array.from(sections).indexOf(entry.target);
                    updateActiveLink(sectionIndex);
                }
            });
        },
        { threshold: 0.5 } // 화면의 50% 이상 보이면 활성화
    );

    sections.forEach((section) => observer.observe(section));

    function updateActiveLink(index) {
        menuLinks.forEach((link) => link.classList.remove("active")); // 기존 active 제거
        menuLinks[index].classList.add("active"); // 현재 보이는 섹션의 링크에 active 추가
    }
});

