class FrontController {
  static home = async (req, res) => {
    try {
      res.render('home')
    } catch (error) {
      console.log(error);
    }
  };

  static about = async (req, res) => {
    try {
      res.render('about');
    } catch (error) {
      console.log(error);
    }
  };

  static gri =  async (req, res) => {
    try {
      res.render('gri');
    } catch (error) {
      console.log(error);
    };
  }

  static features  = async (req, res) => {
    try {
      res.render('features');
    } catch (error) {
      console.log(error);
    };
  }

  static contact = async (req, res) => {
    try {
      res.render('contact');
    } catch (error) {
      console.log(error);
    };
  }

  static login = async (req, res) => {
    try {
      res.render('login');
    } catch (error) {
      console.log(error);
    }
  };
  static benefits = async (req, res) => {
    try {
      res.render('benefits');
    } catch (error) {
      console.log(error);
    }
  };

  static help = async (req, res) => {
    try {
      res.render('help');
    } catch (error) {
      console.log(error);
    }
  };
}


module.exports = FrontController;
