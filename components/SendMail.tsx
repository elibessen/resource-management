import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

const SendMail = () => {
    return(
        <div>
            <form>
                <label>
                    Email Address
                    <input type="text" name="email address"></input>
                </label>
                <label>
                    Cc
                    <input type="text" name="Cc"></input>
                </label>
                <label>
                    Subject
                    <input type="text" name="Subject"></input>
                </label>
                <input type="text" name="Context"></input>
            </form>
        </div>
    )
}

export default SendMail;