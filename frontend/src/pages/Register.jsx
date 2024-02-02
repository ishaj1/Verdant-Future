export default function RegisterPage() {
  const signUpUser = () => {};
  return (
    <>
      <h1>Register</h1>
      <form className="FormElement" onSubmit={(e) => signUpUser(e)}>
        <label htmlFor="username">Username</label>
        <input type="text" name="username" required />
        <label htmlFor="password">Password</label>
        <input type="password" name="password" required />

        <button type="submit">Register</button>
      </form>
    </>
  );
}
