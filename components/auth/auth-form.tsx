import { useState, useRef } from 'react';
import { signIn, getCsrfToken  } from 'next-auth/react';
import { useRouter } from 'next/router';

import classes from './auth.module.css';

async function createUser(email, username, password) {
  const response = await fetch('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ email, username, password }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong!');
  }

  return data;
}

function AuthForm() {
  const emailInputRef = useRef();
  const usernameInputRef = useRef();
  const passwordInputRef = useRef();

  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();

  function switchAuthModeHandler() {
    setIsLogin((prevState) => !prevState);
  }

  async function submitHandler(event) {
    event.preventDefault();

    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    // optional: Add validation

    if (isLogin) {
      const result = await signIn('credentials', {
        redirect: false,
        email: enteredEmail,
        password: enteredPassword,
      });
      console.log(result);
      if (result.ok) {
        // set some auth state
        router.replace('/');
      } else {
        console.log('Didnt log in tbh');
      }
    } else {
      try {
        const result = await createUser(enteredEmail, usernameInputRef.current.value, enteredPassword);
        console.log(result);
        switchAuthModeHandler()
      } catch (error) {
        console.log(error);
      }
    }
  }

  return (
    <section className={classes.auth + " bg-mid-gray"}>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor='email'>Your Email</label>
          <input type='email' id='email' required ref={emailInputRef} />
        </div>
        {!isLogin && <div className={classes.control}>
          <label htmlFor='username'>Your Username</label>
          <input type='username' id='username' required ref={usernameInputRef} />
        </div>}
        <div className={classes.control}>
          <label htmlFor='password'>Your Password</label>
          <input
            type='password'
            id='password'
            required
            ref={passwordInputRef}
          />
        </div>
        <div className={classes.actions}>
          <button>{isLogin ? 'Login' : 'Create Account'}</button>
          <button
            type='button'
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </button>
        </div>
      </form>
    </section>
  );
}

export async function getServerSideProps(context) {
    return {
      props: {
        csrfToken: await getCsrfToken(context),
      },
    };
  }

export default AuthForm;