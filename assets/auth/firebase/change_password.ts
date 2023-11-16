import { auth } from './init';
import { signInWithEmailAndPassword, updatePassword } from 'firebase/auth';

declare const userEmail : string;

const form = document.getElementById('formChangePassword') as HTMLFormElement;

if (form == null) {
    console.error("Can't find the change password form.");
} else {
    form.onsubmit = (event) => {
        event.preventDefault();

        const data = new FormData(form);
        const oldPassword = data.get("old_password") as string;
        const newPassword = data.get("new_password") as string;
        const newPassword2 = data.get("new_password2") as string;

        console.info("TEST", userEmail, oldPassword, newPassword, newPassword2);

        signInWithEmailAndPassword(auth, userEmail, oldPassword).then((userCredential) => {
            updatePassword(userCredential.user, oldPassword);
        }).catch((reason) => {
            console.error(reason);
        });

        return false;
    };
}

