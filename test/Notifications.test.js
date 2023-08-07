const data = require('../public/js/Notification);
const  app = express(); 
app.use(router);

describe('should display notifications', ()=>{
  it('should show notifications', ()=>{
    const data = await request(app);
    expect(document.getElementById("span").toBe("10 minutes ago");//check that the content of the first span element matches 
  });
}
