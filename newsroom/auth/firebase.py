import firebase_admin

from firebase_admin import auth, credentials

creds = credentials.Certificate("./keys/serviceAccountKey.json")
default_app = firebase_admin.initialize_app(creds)


class BaseAuthProvider():
    def change_password(self, user, current_password: str, new_password: str):
        raise NotImplementedError()


class FirebaseAuthProvider(BaseAuthProvider):

    def change_password(self, user, current_password, new_password):
        auth_user = auth.get_user_by_email(user["email"])
        print("UPDATE", auth.update_user(auth_user.uid, password=new_password))
        print("AUTH USER", auth_user, dir(auth_user))


firebase_auth_provider = FirebaseAuthProvider()