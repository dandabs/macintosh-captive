const crypto = require('crypto');

import { getSession } from "@auth0/nextjs-auth0";

let gatewayname = "", 
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
    fas;

export default async function Home({ searchParams }) {
    const session = await getSession();

    if (searchParams["fas"] != null) {
        fas = searchParams["fas"];
    } else {
        return redirect("https://verglas.io");
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

    if (searchParams["auth"] != "yes") {
        return redirect(`/api/auth/login?returnTo=${encodeURIComponent(process.env.AUTH0_BASE_URL + '/?fas=' + fas + "&auth=yes")}`);
    }

    redir = `https://verglas.io`
    const tok = crypto.createHash('sha256').update(hid + process.env.FAS_KEY).digest('hex');

    const custom = btoa(`email=${session.user.email}`)

    const urlToRequest = `http://${gatewayaddress}/opennds_auth/?tok=${tok}&custom=${custom}&redir=${redir}`;

    return redirect(urlToRequest);
}
