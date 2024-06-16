"use client";
import { useState } from "react";

export function LoginForm({ fas, me }) {
    const [fullName, setFullName] = useState("");
    const [stateEmail, setStateEmail] = useState("");

    return (
    <form action={me} method="get" >
        <input type="hidden" name="fas" value={fas} />
        <hr/>Full Name:<br/>
        <input type="text" name="fullname" value={fullName} onChange={(e)=>setFullName(e.target.value)}/>
        <br/>
        Email Address:<br/>
        <input type="email" name="email" value={stateEmail} onChange={(e)=>setStateEmail(e.target.value)}/>
        <br/><br/>
        <input type="submit" value="Accept Terms of Service"/>
    </form>
    )
}