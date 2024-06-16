"use client";
import { useState } from "react";

export function RedirForm({ gatewayurl }) {

    return (
        <form>
        <input type="button" value="Continue" onClick={() => location.href=gatewayurl} />
    </form>
    )
}