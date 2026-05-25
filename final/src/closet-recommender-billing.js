/**
 * AI Closet - Toss Payments Billing Integration
 * - Handles the initialization of TossPayments SDK
 * - Manages the 'Charge Credit' button click event
 * - Detects payment success callback from URL
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. 결제 성공 파라미터 확인 후 토스트 알림 띄우기
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('payment') === 'success') {
    // 딜레이를 주어 페이지 렌더링 후 토스트가 뜨게 함
    setTimeout(() => {
      if(window.showToast) {
        window.showToast("결제가 완료되었습니다! 10 CP가 성공적으로 충전되었습니다. 🎉");
      } else {
        alert("결제가 완료되었습니다! 10 CP가 성공적으로 충전되었습니다. 🎉");
      }
      
      // 포인트 업데이트를 위해 상단 크레딧 표시 갱신 (메인 JS의 state가 아직 초기화 중일 수 있으므로 로컬스토리지 직접 읽음)
      const currentCredits = localStorage.getItem("closet_credits") || "5";
      const navCreditCount = document.getElementById("nav-credit-count");
      if(navCreditCount) navCreditCount.textContent = currentCredits;
      
      // URL 파라미터 깔끔하게 제거
      window.history.replaceState({}, document.title, window.location.pathname);
    }, 500);
  }

  // 2. 토스페이먼츠 연동 로직
  // 부여받은 테스트용 클라이언트 키
  const clientKey = "test_ck_mBZ1gQ4YVXYwdeYZbDE6rl2KPoqN";
  
  // SDK가 로드되었는지 확인
  if (typeof TossPayments === 'undefined') {
    console.error("TossPayments SDK가 로드되지 않았습니다.");
    return;
  }

  const tossPayments = TossPayments(clientKey);
  const tossPayBtn = document.getElementById("toss-pay-btn");
  const billingModal = document.getElementById("billing-modal");

  if (tossPayBtn) {
    tossPayBtn.addEventListener("click", () => {
      // 결제창 띄우기 (랜덤 주문번호 생성)
      const randomOrderId = "ORDER-" + new Date().getTime() + "-" + Math.floor(Math.random() * 1000);
      const currentOrigin = window.location.origin;
      const basePath = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/'));
      
      tossPayments.requestPayment('카드', {
        amount: 9900,
        orderId: randomOrderId,
        orderName: 'AI 옷 추천 10 CP 충전',
        customerName: 'AI 클로젯 유저',
        successUrl: `${currentOrigin}${basePath}/payment-success.html`,
        failUrl: `${currentOrigin}${basePath}/payment-fail.html`,
      }).catch(function (error) {
        if (error.code === 'USER_CANCEL') {
          // 사용자가 결제창을 닫은 경우
          if(window.showToast) window.showToast("결제를 취소하셨습니다.");
        } else {
          alert(error.message);
        }
      });
      
      // 기존 모달 닫기
      if (billingModal) {
        billingModal.classList.remove("active");
      }
    });
  }
});
