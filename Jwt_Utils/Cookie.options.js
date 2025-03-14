const COOKIE_MAX_AGE = process.env.COOKIE_MAX_AGE;
let FinalMaxAge = 1;
COOKIE_MAX_AGE.split('*').map((elem)=>{
    FinalMaxAge*=elem;
})
export const cookieOption = {
  maxAge: FinalMaxAge,
  httpOnly: true,
  secure: true,
};
