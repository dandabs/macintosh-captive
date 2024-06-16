import Head from "next/head";
import Image from "next/image";

const crypto = require('crypto');

import './style.css'
import { headers } from "next/headers";

import { LoginForm } from "./loginform";
import { RedirForm } from "./redirform";

let fullname = "", 
    email = "", 
    gatewayname = "", 
    clientip = "",
    clientmac = "",
    client_type = "",
    cpi_query = "",
    gatewayurl = "",
    version = "",
    originurl = "",
    gatewayaddress = "", 
    hid = "", 
    gatewaymac = "", 
    clientif = "",
    redir = "",
    client_zone = "",
    imagepath = "",
    fas,
    me = "";

export default function Home({ searchParams }) {
    const headerList = headers();
    me = headerList.get("x-current-path");

    if (searchParams["status"] != null) {
        redir = searchParams["redir"];
        const redir_r = redir.split('fas=');
        fas = redir_r[1];
    } else if (searchParams["fas"] != null) {
        fas = searchParams["fas"];
    } else {
        return <p>Error</p>;
    }

    const decoded = Buffer.from(fas, 'base64').toString('ascii');

    if (fas) {
        const dec_r = decoded.split(', ');

        dec_r.forEach(dec => {
            let [name, value] = dec.split("=");
            switch (name) {
                case "clientip": clientip = value; break;
                case "clientmac": clientmac = value; break;
                case "gatewayname": gatewayname = value; break;
                case "gatewayurl": gatewayurl = decodeURIComponent(value); break;
                case "version": version = value; break;
                case "hid": hid = value; break;
                case "client_type": client_type = value; break;
                case "gatewayaddress": gatewayaddress = value; break;
                case "gatewaymac": gatewaymac = value; break;
                case "authdir": authdir = value; break;
                case "originurl": originurl = value; break;
                case "cpi_query": cpi_query = value; break;
                case "clientif": clientif = value; break;
                case "admin_email": admin_email = value; break;
                case "location": location = value; break;
            }
        });

        console.log(clientip);
    }

    let client_zone_r = clientif.trim().split(" ");
    if (!client_zone_r[1]) {
        client_zone = "LocalZone:" + client_zone_r[0];
    } else {
        client_zone = "MeshZone:" + client_zone_r[1].replace(/:/g, "");
    }

    imagepath = `http://${gatewayaddress}/images/splash.jpg`;

    if (searchParams["terms"]) {
        return (
            <FasLayout>
                    <b style={{
                        color: "red"
                    }}>Privacy.</b><br/>
		<b>
			By logging in to the system, you grant your permission for this system to store any data you provide for
			the purposes of logging in, along with the networking parameters of your device that the system requires to function.<br />
			All information is stored for your convenience and for the protection of both yourself and us.<br/>
			All information collected by this system is stored in a secure manner and is not accessible by third parties.<br/>
			In return, we grant you FREE Internet access.
		</b><hr />
            </FasLayout>
        );
    }

    if (searchParams["status"]) {
        return (
            <FasLayout>
                    <p>Status</p>
            </FasLayout>
        );
    }

    if (searchParams["landing"]) {
        return (
            <FasLayout>
                    <med-blue>You are connected to {client_zone}</med-blue><br/>
		<p>
			<big-red>
				You are now logged in and have been granted access to the Internet.
			</big-red>
		</p>
		<hr/>
		<p>
			<italic-black>
				You can use your Browser, Email and other network Apps as you normally would.
			</italic-black>
		</p>
		<p>
		(Your device originally requested {redir})
		<hr/>
		Click or tap Continue to show the status of your account.
		</p>
		<RedirForm gatewayurl={gatewayurl} />
		<hr/>
            </FasLayout>
        );
    }

    if (searchParams["fullname"]) {
        fullname = searchParams["fullname"];
    }

    if (searchParams["email"]) {
        email = searchParams["email"];
    }

    if (fullname == "" || email == "") {
        return (
            <FasLayout>
                <big-red>Welcome!</big-red><br />
			    <med-blue>You are connected to {client_zone}</med-blue><br />
			    <b>Please enter your Full Name and Email Address</b>
                {
                    !searchParams["fas"] ?
                    <>
                    <br /><b style={{
                        color: "red"
                    }}>ERROR! Incomplete data passed from NDS</b>
                    </>
                    :
                    <>

                    <LoginForm fas={fas} me={me} />

				    <hr />

                    <form action={me} method="get">
                        <input type="hidden" name="fas" value={fas} />
                        <input type="hidden" name="terms" value="yes" />
                        <input type="submit" value="Read Terms of Service" />
                    </form>
                    </>
                }
            </FasLayout>
        );
    }

    const authaction = `http://${gatewayaddress}/opennds_auth/`;
    redir = `http://192.168.4.34:3001/fas/?fas=${fas}&landing=1`
    const tok = crypto.createHash('sha256').update(hid + process.env.FAS_KEY).digest('hex');

    const custom = btoa(`fullname=${fullname}, email=${email}`)

    return (
        <FasLayout>
            <big-red>
                Thankyou!
            </big-red>
            <br/>
            <b>Welcome {fullname}</b>
            <br/>
            <med-blue>You are connected to {client_zone}</med-blue><br/>
            <italic-black>
                Your News or Advertising could be here, contact the owners of this Hotspot to find out how!
            </italic-black>
            <form action={authaction} method="get">
                <input type="hidden" name="tok" value={tok} />
                <input type="hidden" name="custom" value={custom} />
                <input type="hidden" name="redir" value={redir} /><br/>
                <input type="submit" value="Continue" />
            </form>
            <hr />
        </FasLayout>
    );
}

function FasLayout({ children }) {
    return (
        <>
        <div className="offset">
            <SplashHeader />
            <div class="insert">
                {children}
                <Footer />
            </div>
        </div>
        </>
    );
}

function SplashHeader() {
    gatewayname = htmlentities(decodeURIComponent(gatewayname));
    return (
        <header className="flex flex-col items-center justify-center">
            <Head>
                <title>{gatewayname}</title>
                <link rel="shortcut icon" href={imagepath} type="image/x-icon" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta charset="utf-8" />
            </Head>
            <med-blue>{gatewayname}</med-blue>
            <br />
        </header>
    )
}

function Footer() {
    const year = new Date().getFullYear();
    return (
        <>
        <hr />
        <div style={{
            fontSize: "0.5em"
        }}>
			<img style={{
                height: "60px",
                width: "60px",
                float: "left"
            }} src={imagepath} alt="Splash Page: For access to the Internet." />
			&copy; The openNDS Project 2015 - {year}<br />
			Portal Version: {version}
			<br/><br/><br/><br/>
		</div>
        </>
    )
}

function htmlentities(str) {
    return str.replace(/[\u00A0-\u9999<>\&]/gim, function(i) {
       return '&#'+i.charCodeAt(0)+';';
    });
}
