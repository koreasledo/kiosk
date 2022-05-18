

    $("#App #AppContent #secondPage").fadeOut();

    // 디스플레이 크기 확인
    var windowWidth = $(window).width();
    
    //키오스트 디스플레이 반응형 크기값 조절 
    function KIOSTIMGDISPLAYSIZE() {
        let kiostImgWidth = $("#kiostImg img").width() * 0.62;
        $(".container").css("max-width", `${kiostImgWidth}px`);
        $("#mainLoding").css("width", `${kiostImgWidth}px`);
    };
    KIOSTIMGDISPLAYSIZE();
    
    $(window).resize(KIOSTIMGDISPLAYSIZE);
    

    //화면 크기 확대, 로딩로고
    $(".main_oderbtn").click(() => {
        $("#mainWrap").addClass("scale");
        $("#firstpage").slideUp(1000);
        $("#mainLoding").animate({
            top: "6%"
        }, 1000);
        setTimeout(function () {
            $("#mainLoding").fadeOut(500);
            setTimeout(() => {
                $("#App #AppContent #secondPage").fadeIn();
            }, 500)
        }, 1000)
    });

    // 메뉴 네비바 

    // Json 데이터 아이템 목록 불러오는 함수
    function showItemArr(seleteMemu) {

        let Memudivision = [];
        
        // 한페이지에 보여질 페이지 갯수
        let pagingCounter;
        
        windowWidth < 500 ? pagingCounter = 6 : pagingCounter = 8

        for (i = 0; i < seleteMemu.length; i += pagingCounter) Memudivision.push(
            seleteMemu.slice(i, i + pagingCounter));
        // console.log(Memudivision)

        // 배열 갯수 = 표시될 페이지 갯수  
        let MemuPageCount = Memudivision.length;

        //부모박스를 자식박스 만큼 width 값 늘려주기 
        $("#MenuFoodWrap").css("width", `${MemuPageCount}00%`);

        let memuItemHTML = []; //문자를 담을 배열 생성

        for (i = 0; i < Memudivision.length; i++) {
            memuItemHTML.push(`<div class="Menu_silder">`);
            for (j = 0; j < Memudivision[i].length; j++) {
                memuItemHTML.push(`
                <div class="mainMenuFood">
                    <img class="menuBurger" src="${Memudivision[i][j].img}">
            
                    <div class="Food_body">
                        <p class="foodName">${Memudivision[i][j].name}</p>
                        <div class="Food_price">
                            <span class="foodOnlyPrice">${Memudivision[i][j].onlyprice}</span>
                        </div>
                    </div>

                    <input type="text" name="desc" value="${Memudivision[i][j].desc}" hidden>
                </div>
            `);

            }
            memuItemHTML.push(`</div>`);
        }

        let SaveMemuItemHTML = memuItemHTML.join("");

        $("#MenuFoodWrap").html(SaveMemuItemHTML);

        // -------------------------------------------------------------------

        // 아이템 슬라이드 위치 초기화
        $("#MenuFoodWrap").css("left", "0%");
        // console.log(Memudivision.length)

        if (Memudivision.length == 1) {
            $(".mcbtn").hide();
        } else {
            $(".mcbtn").show();
            $("#menuBtnL").hide();
        }

        // 햄버거 버튼 작동;
        SELECTPOP();


    }
    // // Json 데이터 아이템 목록 불러오는 함수

    //메뉴 처음 보여줄 내용
    $.ajax({
        type: 'GET',
        url: './public/json/munu.json',
        //성공시
        success: function (data) {

            // 첫번째 매뉴 보여주기
            let seleteMemu = data[0].memu[0].new;
            // console.log(seleteMemu.length);
            showItemArr(seleteMemu);

        }
    });


    // 메뉴네비바에 자식인 a링크 를 클릭했을 했을떄 이벤트를 발생시킴
    $(".headMenuNav").children("a").click(function (e) {

        $(".headMenuNav a").removeClass("backwhite");
        $(this).addClass("backwhite");

        // usersClick =  내가 누른 번호 불러오기, usersClickName = 이름 불러오기
        let usersClickNo = e.target.dataset.id;
        let usersClickName = e.target.dataset.name;





        // 데이터 가져오기
        $.ajax({
            type: 'GET',
            url: './public/json/munu.json',
            //성공시
            success: function (data) {

                let seleteMemu = data[0].memu[usersClickNo][usersClickName];

                showItemArr(seleteMemu);
            },
            // 실패시
            error: function () {
                alert('Error occured');
            }
        });



        //버튼 조작  2
        $("#menuBtnR").click(() => {
            $("#menuBtnR").fadeOut(100);
            $("#menuBtnL").fadeIn(100);
            $("#MenuFoodWrap").animate({
                left: "-100%"
            }, 500)
        })


        $("#menuBtnL").click(() => {
            $("#menuBtnL").fadeOut(100);
            $("#menuBtnR").fadeIn(100);
            $("#MenuFoodWrap").animate({
                left: "0%"
            }, 500)
        })

        // 만약에 음료 사이드를 눌렀을때? 구매버튼을 다르게함.
        if (usersClickNo == 3 || usersClickNo == 4) {
            $("#sp_cont2Open").hide();
            $("#sp_cont2OpenSide").show();
        } else {
            $("#sp_cont2OpenSide").hide();
            $("#sp_cont2Open").show();
        }

    });

    function SELECTPOP() {

        // 햄버거를 클릭했을때 
        $(".mainMenuFood").click(function (e) {

            // 팝업2의 checked 초기화
            $('input:radio[ data-choose="단품"]').prop('checked',true);
            $('input:radio[ data-choose="음료선택안함"]').prop('checked',true);
            $('input:radio[ data-choose="사이드선택안함"]').prop('checked',true);


            let info = $(this).children()

            // 이름 가져오기
            let Thisimg = info[0].outerHTML; //선택한 아이템의 이미지 경로
            let Thisname = info[1].childNodes[1].innerHTML; // 사품이름 
            let Thisonlyprice = info[1].childNodes[3].childNodes[1].innerHTML; // 단품가격
            let ThisDesc = info[2].value; // 설명

            //클릭하면 팝업을 띄움 
            $("#SPselectionPopup").show();

            // 닫기버튼 누르면 사라짐
            $(".sp_close").click(() => {
                $("#SPselectionPopup").hide();
            });

            //클릭한 이미지를 넣어줌 
            $(".spImgWrap").html(Thisimg);


            // 클릭한 이름을 팝업이름으로 해줌 
            $("#selectPopName, .spTiname h3").text(Thisname); //1번
            // $("").text(Thisname);//1번

            // 클릭한 이름을 팝업가격으로 해줌 
            $(".spipric").text(Thisonlyprice); //1번
            // $("").text(Thisname);//1번


            //클릭한 제품의 설명을 넣어줌 
            $(".sptdDesc").text(ThisDesc);

            // 팝업1을 클릭했을때
            $("#sp_cont2Open").click(function () {

                //팝업1은 사라지고
                $("#SPselectionPopup").hide();

                //팝업2를 보여줌
                $("#SPChoosePopup").fadeIn();


            });

            // 팝업1을 클릭했을때
            $("#sp_cont2OpenSide").click(function () {

                //팝업1은 사라지고
                $("#SPselectionPopup").hide();

                //팝업2를 보여줌
                $("#SPChoosePopup").hide();


            });


        });
    };

    SELECTPOP(); // 햄버거를 클릭했을때 바로실행

    // 팝업창에 갯수 인풋박스 업다운 버튼 
    let updownSelnumVal = parseInt($('input[name="selnum"]').val());
    // 다운아이콘을 눌렀을때 1씩 줄어듬
    $("#spTCountDown").click(() => {
        $('input[name="selnum"]').val(updownSelnumVal--);
    });

    // 다운아이콘을 눌렀을때 1씩 늘어남
    $("#spTCountUP").click(() => {
        $('input[name="selnum"]').val(updownSelnumVal++);
    });



    // 팝업 2에서 취소 버튼을 눌렀을 때 사라지게 함 
    $("#choosePopbtnclose").click(function (e) {
        e.preventDefault();
        $("#SPChoosePopup").fadeOut();
    });


    // 상품리스트에 담을 빈배열 생성
    var userlist = [];
    ////총 금액 넣을거 
    let SumchongPrice = [];
    let SumNum = [];


    // 상품선택을 확인 하면 이벤트를 발생 시켜줄거임 
    // product
    function PRODUCT() {

        $("#choosePopbtnSub, #sp_cont2OpenSide").click(function (e) {


            // 이벤트 버블링을 막아줌 기존 이벤트 리로드하는 성질을 죽임
            e.preventDefault();


            // 선책한 값을 받아옴 
            let name = $(".spTiname h3").text(); // 상품이름
            let price = $(".spTiname p").text(); // 상품가격
            let num = $('input[name="selnum"]').val(); // 상품 갯수

            let burN = $('input:radio[name="bur"]:checked').data('choose'); //버거 고른거 가격  추가한거 이름
            let bur = $('input:radio[name="bur"]:checked').val(); //버거 고른거 가격

            let driN = $('input:radio[name="dri"]:checked').data('choose'); // 음료 추가 한거  추가한거 이름
            let dri = $('input:radio[name="dri"]:checked').val(); // 음료 추가 한거

            let sideN = $('input:radio[name="side"]:checked').data('choose'); // 사이트 추가한거 이름
            let side = $('input:radio[name="side"]:checked').val(); // 사이트 추가한거

            // 1번 팝업 사라지게 함
            $("#SPChoosePopup").hide();

            //// 클릭한 주문 목록 넣을 배열 생성
            userlist.push([name, price, num, burN, bur, driN, dri, sideN, side]);

            ////리스트 넣을꺼
            let oderList = [];

            //계산 함수
            function CALCULATE() {

                //총 번호 담을거
                let chongNum = [];

                //총금액 담을거
                let chongPrice = [];

                for (let i = 0; i < userlist.length; i++) {
                    /// 주문 갯수 합계
                    chongNum[i] = parseInt(userlist[i][2]);

                    ////주문금액 계산 = (상품 가격 + 버거 옵션 + 음류 옵션 + 사이드 옵션) * 갯수 
                    chongPrice[i] = (parseInt(userlist[i][1]) + parseInt(userlist[i][4]) + parseInt(
                        userlist[i][
                            6
                        ]) + parseInt(userlist[i][8])) * parseInt(userlist[i][2]);
                }

                //// 모든 n번째 갯수게산 
                let resultNum = chongNum.reduce((a, b) => a + b);

                // 모든 n번째 가격게산 
                let resultPrice = chongPrice.reduce((a, b) => a + b);

                // 갯수 화면 출력
                $("#chongNum").val(resultNum);
                //결제 페이지 출력
                $("#OKchongNum").text(resultNum);


                // 가격 화면 출력
                $("#chongPrice").val(resultPrice);
                //결제 페이지 출력
                $("#OKchongPrice").text(resultPrice);
                //영수증 출력
                $(".RspcpchongPrice").text(resultPrice);

            };
            //계산 함수 실행
            CALCULATE();

            //계산 리셋 함수
            function RESETCALCULATE() {
                $("#chongNum").val(0);
                $("#chongPrice").val(0);
            }


            //// 전체 취소 클릭했을때 
            $("#listCancelAll").click(function () {
                // 리스트 초기화
                userlist = [];
                //화면 초기화
                $("#odercont1").html("");
                RESETCALCULATE();
            });



            // //내가 누른 상품 리스트 생성 
            function ITEMSHOWLIST() {
                //리스트 출력 for문 
                for (let i = 0; i < userlist.length; i++) {
                    oderList.push(`
                <div class="oderItem">
                    <ul>
                        <li>${userlist[i][0]}</li>
                        <li>
                            <input type="text" value="${userlist[i][2]}" readonly>
                        </li>

                        <li><span class="oderItemdon">${(parseInt(userlist[i][1]) + parseInt(userlist[i][4]) + parseInt(userlist[i][6]) + parseInt(userlist[i][8]))* parseInt(userlist[i][2]) }</span> <span>원</span></li>
                        <li class ="oderItemdonDele"><i class="xi-trash"></i></li>
                    </ul>

                    <p>
                        <span><i class="xi-subdirectory-arrow"></i> [</span>
                        <strong>${userlist[i][3]}:${userlist[i][4]} + ${userlist[i][5]}:${userlist[i][6]} + ${userlist[i][7]}:${userlist[i][8]}</strong>
                        <span> ] </span>
                    </p>
                </div>`);
                };
            };

            // //내가 누른 상품 리스트 생성 함수 실행
            ITEMSHOWLIST();

            //리스트 저장하고 배열을 합처줌
            var saveoderListHtml = oderList.join("");
            // 출력 해줌 
            $("#odercont1").html(saveoderListHtml);
            $("#OKodercont1").html(saveoderListHtml);
            $("#Receiptcont1").html(saveoderListHtml);




            // 리스트에 삭제 버튼 
            $(".oderItemdonDele").click(function () {
                // console.log(userlist);

                let closest = $(this).closest('div').index();

                // 클릭한 배열의 요소 n 번째 배열 제거 
                userlist.splice(closest, 1);

                // 동적으로 보이게 하기 위해 사라지게 보이게 만듬 
                $(this).closest('div').remove();

                // 갯수가 0이라면  리셋을 해주고 아니면 가격을 계산함 
                userlist == 0 ? RESETCALCULATE() : CALCULATE();
            });




            //주문하기 클릭하면 ---------------------------------
            $("#listOkey").click(function () {


                // 결제 팝업 창을 띄움 
                $("#SPOkeyPopup").show();

                //취소 버튼을 눌렀을때
                $("#Okcancel").click(() => {
                    $("#SPOkeyPopup").hide();
                });

                //신용카드 버튼을 눌렀을때 
                $("#Okcard").click(() => {
                    // 포장인지 먹고가는지 데이터값을 가져옴
                    let takeEating = $('input:radio[name="takeeating"]:checked').val();
                    // 포장인지 먹고가는지 데이터값를 영수증에 출력
                    $("#ReceiptTakeEating").text(takeEating);

                    // 1팝업창은 닫아준다
                    $("#SPOkeyPopup").hide();
                    // 2카드결제 팝업을 보여주고
                    $("#spCardPopup").show();

                    // 3.확인을 눌러주면 핸드폰 애니메이션 3초정도
                    $("#spcpCardOk").click(() => {
                        //확인 버튼은 사라지고
                        $("#spcpCardOk").hide();
                        // 로딩창이 뜸
                        $(".card_loding_container").show();

                        // 시간초
                        let displaytime = 3000;

                        //로딩창이 뜨면 displaytime 초동안 로딩이 차오름
                        $('.Loading span').animate({
                            width: $('.Loading span').data('charge') + '%'
                        }, displaytime);

                        // 화면 확대를 다시 원본으로 바꿈
                        $("#mainWrap").removeClass("scale");
                        $("#mainWrap").addClass("originally");

                        // 4. displaytime초 뒤에 실행시켜줄거임 영수증 확인창 출력을
                        setTimeout(() => {

                            $(".cardContents").html(`
                        <article>
                            <ul>
                                <li>결제가 완료되었습니다.</li>
                                <li>대기번호</li>
                                <li id="spcpCardRanCont">000</li>
                                <li>영수증을 꼭 가져가세요</li>
                                <li>
                                    <img src="./public/img/receipt_icon.svg" alt="card">
                                </li>
                                <li>제품 수령시 영수증의 대기번호가 필요합니다<br>
                                    꼭 소지 부탁드립니다.
                                </li>
                                <li id="TimeWrap"><span id="TimeToFive">5</span>초뒤에 처음으로 돌아갑니다</li>

                            </ul>
                        </article>
                        `);

                            const waitingNumber = Math.floor(Math.random() *
                                999);

                            // 5.대기번호를 랜덤으로 출력해줄거임
                            $("#spcpCardRanCont").text(waitingNumber);
                            $("#RspcpCardRanCont").text(waitingNumber);

                            // 6. 영수증 출력해줄거임 
                            $("#Receipt").slideDown(3000);

                            // 3초 뒤에 실행해줄거임 
                            setTimeout(() => {
                                // 시간이 글씨가 보이게 해줌
                                $("#TimeWrap").fadeIn();

                                //타이머 시간 
                                var conterSecond = 5;
                                // 타이머 실행 
                                var timer = setInterval(RELODING,
                                    1000);

                                //타이머 함수 생성
                                function RELODING() {
                                    // 실행될떄마다 카운터를 1씩빼줌
                                    conterSecond--;
                                    // 만약에 카운터가 0 이되면 반복재생을 멈추고 리로드
                                    if (conterSecond == 0) {
                                        console.log("끝");
                                        clearInterval(timer);
                                        location.reload();
                                    } else {
                                        $("#TimeToFive").text(
                                            conterSecond);
                                    }
                                }
                            }, 2500)
                        }, displaytime);
                    });
                });
            });
        });
    }
    PRODUCT();

    // 첫화면 버튼 
    $("#ex").click(function () {
        location.reload();
    });