/**
 * Created by cheese on 2017. 1. 23..
 */

const
    express = require('express'),
    router = express.Router(),
    bcrypt = require('bcrypt'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    // async = require('async'),
    // CommonDAO = require('../RedisDAO/CommonDAO'),
    // UTIL = require('../util/util'),
    User = require('../service/UserService'),
    Common = require('../service/CommonService'),
    Broadcast = require('../service/BroadcastService'),
    Event = require('../service/Eventservice'),
    Content = require('../service/ContentService'),
    Reply = require('../service/UserService');


/**
 * URI에 리소스명은 동사보다는 명사를 사용한다.
 * URI에 동사는 http 메서드로 대신한다.
 * 가급적이면 의미상 단수형 명사(/dog)보다는 복수형 명사(/dogs)를 사용하는 것이 의미상 표현하기가 더 좋다.
 *
 * 만약에 관계의 명이 복잡하다면 관계명을 명시적으로 표현하는 방법이 있다. 예를 들어 사용자가 “좋아하는” 디바이스 목록을 표현해보면
 * HTTP Get : /users/{userid}/likes/devices
 * 예) /users/terry/likes/devices
 *
 * 에러핸들링 공통 로직이될거같으니 하나의 힘수로 만들자
 * 가급적이면 Error Code 번호를 제공하는 것이 좋다.
 *
 * 200 성공
 * 400 Bad Request - field validation 실패시
 * 401 Unauthorized - API 인증,인가 실패
 * 404 Not found ? 해당 리소스가 없음
 * 500 Internal Server Error - 서버 에러
 *
 * 공통 URL = /api/v1/
 *
 * {행위} , {HTTP Method}, {URI}
 *
 * 로그인, 댓글, 답글, 회원가입, 아이디중복검사, 닉네임중복검사, 아이디찾기, 비빌번호 찾기(새롭게 설정함)
 * 조회수 증가로직, 게임 로그인을 위한 회원가입(유저아아디, 닉네임 받아야됨)
 * 회원 정보수정, 로그아웃,
 *
 *
 * {로그인}, {POST}, {/login}
 * {회원가입}, {POST}, {/signup}
 * {아이디중복검사}, {GET}, {/users/duplication/user_id?user_id={payer001}}
 * {닉네임중복검사}, {GET}, {/users/duplication/nickname?nickname={payer001}}
 * {회원 정보수정}, {PUT}, {/myinfo}
 * {}, {}, {}
 * {}, {}, {}
 * {}, {}, {}
 * {}, {}, {}
 * {}, {}, {}
 * {}, {}, {}
 * {}, {}, {}
 * {}, {}, {}
 * {}, {}, {}
 *
 */


passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});


const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated())
        return next();
    res.redirect('/login');
};

/**
 * 홀덤쿨럽 티비 로그인 API
 * 로그인 실패시 로그인실패 카운트 증가, 로그인 실패 10일경우 계정락
 */

passport.use(new LocalStrategy({
    usernameField: 'user_id',
    passwordField: 'password',
    passReqToCallback: true
}, (req, usernameField, passwordField, done) => {
    Common.login(usernameField, passwordField, (err, result) => {
        if (err) {
            return done(null, false);
        } else {
            console.log(result);
            if (result.success) {
                return done(null, result.admin_info);
            } else {
                return done(null, false);
            }
        }
    });
}
));

router.get('/logout', (req, res) => {
    console.log('logout');
    req.logout();
    res.redirect('/');
});

router.post('/hc/login', passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true
}), (req, res) => {
    res.redirect('/');
});


//broadcast API Start
router.post('/broadcast/live', (req, res) => {
    // TODO 유효성 검사 추가해야됨
    const link = req.body.link;
    Broadcast.onLive(link, (err, result) => {
        if (!err) {
            res.json(result);
        } else {
            res.json(result);
        }
    });
});

router.get('/broadcast/live', (req, res) => {
    // TODO 유효성 검사 추가해야됨
    Broadcast.getLiveList((err, result) => {
        if (!err) {
            res.json(result);
        } else {
            res.json(err);
        }
    });
});

router.put('/broadcast/live', (req, res) => {
    const id = req.body.id;
    Broadcast.endLive(id, (err, result) => {
        if (!err) {
            res.json(result);
        } else {
            res.json(result);
        }
    });
});

/*아직 사용안하고 있음*/
router.delete('/broadcast/live', (req, res) => {
    const id = req.body.id;
    Broadcast.endLive(id, (err, result) => {
        if (!err) {
            res.json(result);
        } else {
            res.json(result);
        }
    });
});

router.post('/broadcast/calendar', (req, res) => {
    Broadcast.uploadCalendar(req, (err, result) => {
        if (!err) {
            res.json(result);
        } else {
            res.json(result);
        }
    });
});

router.delete('/broadcast/calendar', (req, res) => {
    const id = req.body.id;
    Broadcast.deleteCalendar(id, (err, result) => {
        if (!err) {
            res.json({success: true, msg: '삭제를 완료했습니다.'});
        } else {
            res.json({success: false, msg: '다시 시도해주세요'});
        }
    });
});
//broadcast API END

//event API Start
router.post('/event/result', (req, res) => {
    Event.uploadResult(req, (err, result) => {
        console.log(err);
        res.json(result);
    });
});

router.delete('/event/result', (req, res) => {
    const event_id = req.body.event_id;
    Event.delete(event_id, (err, result) => {
        if (!err) {
            res.json({success: true, msg: '삭제를 완료했습니다.'});
        } else {
            res.json({success: false, msg: '다시 시도해주세요.'});
        }
    });
});
//event API END

//content API END
router.post('/content', (req, res) => {
    const
        ref_id = req.body.ref_id,
        type = req.body.type;
    Content.register(ref_id, type, (err, result) => {
        if (!err) {
            res.json({success: true, msg: '등록완료'});
        } else {
            res.json({success: false, msg: '다시 시도해주세요.'});
        }
    });
});

router.delete('/content', (req, res) => {
    const
        id = req.body.id;
    Content.delete(id, (err, result) => {
        if (!err) {
            res.json({success: true, msg: '삭제 완료'});
        } else {
            res.json({success: false, msg: '다시 시도해주세요.'});
        }
    });
});

router.put('/content', (req, res)=>{
    
    const
        id = req.body.id,
        ref_id = req.body.ref_id,
        type = req.body.type;
    
    Content.update(id, ref_id, type, (err, result)=>{
        if (!err) {
            res.json({success: true, msg: '수정 완료'});
        } else {
            res.json({success: false, msg: '다시 시도해주세요.'});
        }
    });
});

//content API END


/**
 * HC_TV API
 */

/**
 * 홀덤클럽 회원가입
 */
router.post('/signup', (req, res) => {
    
    // TODO _obj 검사 그런데 마켓팅코드는 입력안할수있는데??, password === re_password  검사
    const _obj = {
        user_id: req.body.user_id,
        nickname: req.body.nickname,
        password: bcrypt.hashSync(req.body.password, 10),
        email: req.body.email,
        market_code: req.body.market_code || null,
        signup_dt: new Date()
    };
    
    User.signUp(_obj, (err, result) => {
        if (!err) {
            res.json(result);
        } else {
            res.json(result);
        }
    });
});


router.get('/users/duplication/user_id', (req, res) => {
    const user_id = req.query.user_id;
    
    User.duplicateByUserId(user_id, (err, result) => {
        if (!err) {
            res.json(result);
        } else {
            res.json(result);
        }
    });
});

router.get('/users/duplication/nickname', (req, res) => {
    const nickname = req.query.nickname;
    
    User.duplicateByNickname(nickname, (err, result) => {
        if (!err) {
            res.json(result);
        } else {
            res.json(result);
        }
    });
});

router.get('/users/duplication/email', (req, res) => {
    const email = req.query.email;
    
    User.duplicateByEmail(email, (err, result) => {
        if (!err) {
            res.json(result);
        } else {
            res.json(result);
        }
    });
});

router.post('/reply', (req, res) => {
    //TODO 댓글이랑 답글을 한곳에서 처리하자
    
    const _obj = {
        video_id: req.body.video_id,
        comment: req.body.comment_content,
        nickname: req.user.nickname
    };
    
    Reply.write(_obj, (err, result) => {
        if (!err) {
            res.json(result);
        } else {
            res.json(result);
        }
    });
});

router.put('/reply', (req, res) => {
    
    const _obj = {
        id: req.body.id,
        comment: req.body.comment_content,
    };
    
    Reply.modify(_obj, (err, result) => {
        if (!err) {
            res.json(result);
        } else {
            res.json(result);
        }
    });
});

router.delete('/reply', (req, res) => {
    
    const reply_id = req.body.id;
    
    Reply.remove(reply_id, (err, result) => {
        if (!err) {
            res.json(result);
        } else {
            res.json(result);
        }
    });
});


module.exports = router;