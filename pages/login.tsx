import Landing from '../components/Landing/Landing';
import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const session = await getSession(ctx);
  if (session) {
    if(process.env.NODE_ENV === 'production') {
      return {
        redirect: {
          destination: '/help',
          permanent: false,
        },
      };
    }
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}

export default function Login() {
  return (
    <>
      <Landing />
    </>
  );
}
