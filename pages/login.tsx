import Landing from "../components/Landing/Landing";
import {GetServerSidePropsContext} from "next";
import {getSession} from "next-auth/react";

export async function getServerSideProps(ctx : GetServerSidePropsContext) {
  const session = await getSession(ctx);
  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false
      }
    };
  }

  return {props: {}};
}

export default function Login() {
  return (<> {
    " "
  } < head > {
    " "
  } < link rel = "icon" href = "https://tamudatathon.com/static/img/favicons/favicon.ico" /> </head>
<Landing/>
</>);
}
