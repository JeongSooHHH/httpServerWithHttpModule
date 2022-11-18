// 회원가입 엔드포인트 , users 정보를 배열, 즉 API 서버의 메모리에 저장되어 있어 재부팅하면 모든 정보가 사라짐. 이에 DB가 필요함. 데이터 영구저장을 위해
// 1.유저 회원 가입하기, 2.게시글 등록하기, 3.게시글 목록 조회하기, 4.게시글 수정하기, 5.게시글 삭제하기, 6.유저와 게시글 조회하기
const http = require('http') //(1) nodejs의 http 모듈 호출
const server = http.createServer();

const users=[ //(2) 새롭게 회원가입 하는 사용자 정보를 저장할 배열을 users라는 변수에 정의, 배열안에 객체 형태로 회원정보를 저장
    {
        id: 1,
        name: "Rebekah Johnson",
        email: "Glover12345@gmail.com",
        password: "123qwe",
      },
      {
        id: 2,
        name: "Fabian Predovic",
        email: "Connell29@gmail.com",
        password: "password",
      },
    ]

    const posts =[
        {
            id: 1,
            title: "간단한 HTTP API 개발 시작!",
            description: "Node.js에 내장되어 있는 http 모듈을 사용해서 HTTP server를 구현.",
            userId: 1,
          },
          {
            id: 2,
            title: "HTTP의 특성",
            description: "Request/Response와 Stateless!!",
            userId: 1,
          },
    ]
    // const postGet = {  // 키값을 post
      

    // }
    /*	{
	    "userID"           : 1,
	    "userName"         : "Rebekah Johnson",
      "postingId"        : 1,
      "postingTitle"     : "간단한 HTTP API 개발 시작!",
	    "postingContent"   : "Node.js에 내장되어 있는 http 모듈을 사용해서 HTTP server를 구현."
	},*/   
     

    const httpRequestListener = function (request, response){
        const {url, method} = request
           
            if(method ==='POST'){  //(3) "/ping" 엔드포인트와 마찬가지로 request message에서 꺼내온 http method(POST), target(/users) 정보와 if문을 사용해서 엔드포인트를 정의함.
                if(url==='/users/signup'){   // httpie 이용해서 등록 시 signup까지 지정을 잘 해줘야함
                    let body =''; //(4)(5) HTTP 요청을 통해 전송된 body에 담긴 회원 정보를 읽어들임
                    
                    request.on('data', (data) => {
                        body+= data;  // 받아 들인 데이터를 계속 추가함.
                    }) //(4)(5) 간단하게는 짧은 단위로 나눠져 받아지는 body에 담겨있는 데이터를 하나로 합쳐 body라는 변수에 정의

                    //stream을 전부 받아온 이후에 실행
                    request.on('end', () =>{    //(6) 4,5과정에서 데이터를 정상적(200)으로 받아온 이후 자동실행코드, 정확히는 request.on()함수에 인자로 전달한 arrow function이 실행됨
                        const user = JSON.parse(body);   //(7) JSON.parse()를 활용해서 HTTP 요청을 통해 전송된 JSON 데이터를 javascript object로 변환

                        users.push({    //(8) Client로부터 받은 사용자 정보를 객체 형태로 만들어서 users 배열을 추가해주면서, 회원 등록을 완료
                            id: user.id,
                            name: user.name,
                            email: user.email,
                            password: user.password
                        })
                        response.writeHead(200, {'Content-Type':'application/json'}) // json 객체 타입으로 저장함.
                        response.end(JSON.stringify({ 'data' :users}))     //(9) 마지막으로 회원가입이 성공적으로 끝났음을 응답
                    })
                }

                /* ================▲ 유저 회원가입    ▼ 게시글 등록하기=================*/
                if(url==='/users/post'){ 
                  let body =''; 
                    
                request.on('data', (data) => {
                    body+= data; 
                }) 
                
                request.on('end', () =>{   
                    const post = JSON.parse(body);   

                    posts.push({    
                      id: post.id,
                      title: post.title,
                      description: post.description,
                      userId: post.userId                      
                    })
                    response.writeHead(200, {'Content-Type':'application/json'}) 
                    response.end(JSON.stringify({ 'data' : posts}))     
                })
            }}
            
    // ===============▼ 게시글 목록 조회하기 pingpong 과 같은 방식으로 post 불러오면 되지 않을까(호출부분만!) GET으로/*
    //         if(method==='GET'){
    //           if(url ==='/users/post'){
    //             response.writeHead(200, {'Content-Type' : 'application/json'})
    //             response.end(JSON.stringify({'data': posts}))            
    //         }
    //     }
    //   }



    // ==================
    server.on("request", httpRequestListener);

    server.listen(8000, '127.0.0.1', function(){
        console.log('Listening to requests on port 8000')
    })}