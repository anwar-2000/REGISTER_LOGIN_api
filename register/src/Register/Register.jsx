import React from 'react'
import { useState, useRef , useEffect } from 'react'
import {faCheck , faTimes , faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import axios from '../api/Axios'

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;


const REGISTER_URL = '/register'
const Register = () => {
   const userRef = useRef()
    const errRef = useRef()
    //inputs
    const [user,setUser] = useState('')
    const [validName,setValidName] = useState(false)
    const [userFocus,setUserFocus] = useState(false)
    //inputs
    const [pwd,setPwd] = useState('')
    const [validPwd,setValidPwd] = useState(false)
    const [pwdFocus,setPwdFocus] = useState(false)

    //inputs
    const [matchPwd,setMatchPwd] = useState('')
    const [validMatchPwd,setValidMatchPwd] = useState(false)
    const [matchFocus,setMatchFocus] = useState(false)
    

    //messages
    const [err,setErr] = useState('')
    const [success,setSuccess] = useState(false)

    //useEffect
            useEffect(()=>{
                userRef.current.focus();
            },[])
            //username testing
            useEffect(()=>{
                //testing the regex and the user
                setValidName(USER_REGEX.test(user));
            },[user])

            //password testing
            useEffect(()=>{
                //testing the regex and the user
                setValidPwd(PWD_REGEX.test(pwd));

                setValidMatchPwd(matchPwd===pwd);
            },[pwd,matchPwd])
            //resetting the error message after inputing again
            //username testing
            useEffect(()=>{
                setErr('')
            },[user,pwd,matchPwd])


            //submitting handler
            const submitHandler =  async (e) => {
                e.preventdefault();
                // if somehow enabling the buttton via dev tools ....
                const v1 = USER_REGEX.test(user);
                const v2 = PWD_REGEX.test(pwd);
                if(!v1 || !v2) {
                    setErr('invalid Entry');
                    return ;
                }
                try{    
                    const response = await axios.post(REGISTER_URL,
                        JSON.stringify({
                            user,pwd
                        }),
                        {
                            headers : {'Content-Type' : 'application/json'},
                            withCredentials : true
                        })
                        console.log(response.data)
                        setSuccess(true);
                        //clear inputs field if you want
                }catch(err){
                    if(!err?.reponse){
                        setErr('no server response ! ')
                    }
                    else if (err.response?.status === 409){
                        setErr('username taken');
                    }
                    else {
                        setErr('registration failed');
                        errRef.current.focus();
                    }
                }
            }

       return <>
            {success ? 
                (
                    <section>
                        <h1>Success !</h1>
                        <p>
                            <a href='#'>Sign in !</a>
                        </p>
                    </section>
                )
             :
             (
       <section>
            <p ref={errRef} className= {err ? "errmsg" : "offscreen"} aria-live="assertive">{err}</p>
            <h1>REGISTER</h1>
            <form>
                    <label htmlFor='username'>
                        Username :
                             <FontAwesomeIcon icon={faCheck} className={validName ? "valid" : "hide"} />
                             <FontAwesomeIcon icon={faTimes} className={validName || !user ? "hide" : "invalid"} />
                    </label>
                    <input
                        type="text"
                        id='username'
                        ref={userRef}
                        aria-invalid = {validName ? "false" : "true" }
                        autoComplete="off"
                        required
                        aria-describedby='uidote'
                        onChange={(e)=> setUser(e.target.value)}
                        onFocus = {() => setUserFocus(true)}
                        onBlur = {() => setUserFocus(false)}
                    />
                    <p
                        id='uidnote'
                        className={userFocus && user && !validName ? 'instructions' : 'offscreen'}
                    >
                    <FontAwesomeIcon icon={faInfoCircle} />
                        4 to 24 length . <br/>
                        Must begin with a letter . <br />
                        number allowed .
                    </p>


                    <label htmlFor='password'>
                        Password:
                             <FontAwesomeIcon icon={faCheck} className={validPwd ? "valid" : "hide"} />
                             <FontAwesomeIcon icon={faTimes} className={validPwd || !pwd ? "hide" : "invalid"} />
                    </label>
                    <input
                    type="password"
                    id="password"
                    onChange={(e) => setPwd(e.target.value)}
                    value={pwd}
                    required
                    aria-invalid={validPwd ? "false" : "true"}
                    aria-describedby="pwdnote"
                    onFocus={() => setPwdFocus(true)}
                    onBlur={() => setPwdFocus(false)}
                />
                <p id="pwdnote" className={pwdFocus && !validPwd ? "instructions" : "offscreen"}>
                    <FontAwesomeIcon icon={faInfoCircle} />
                    8 to 24 characters.<br />
                    Must include uppercase and lowercase letters, a number and a special character.<br />
                    Allowed special characters: <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
                </p>


                <label htmlFor="confirm_pwd">
                    Confirm Password:
                    <FontAwesomeIcon icon={faCheck} className={validMatchPwd && matchPwd ? "valid" : "hide"} />
                    <FontAwesomeIcon icon={faTimes} className={validMatchPwd || !matchPwd ? "hide" : "invalid"} />
                </label>
                <input
                    type="password"
                    id="confirm_pwd"
                    onChange={(e) => setMatchPwd(e.target.value)}
                    value={matchPwd}
                    required
                    aria-invalid={validMatchPwd ? "false" : "true"}
                    aria-describedby="confirmnote"
                    onFocus={() => setMatchFocus(true)}
                    onBlur={() => setMatchFocus(false)}
                />
                <p id="confirmnote" className={matchFocus && !validMatchPwd ? "instructions" : "offscreen"}>
                    <FontAwesomeIcon icon={faInfoCircle} />
                    Must match the first password input field.
                </p>

                <button disabled={!validName || !validPwd || !validMatchPwd ? true : false}>Sign Up</button>
            </form>
            <p>
                Already registered?<br />
                <span className="line">
                    {/*put router link here*/}
                    <a href="#">Sign In</a>
                </span>
            </p>
        </section>
        )
    }
        </>

  
}

export default Register