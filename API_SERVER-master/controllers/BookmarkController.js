const Repository = require('../models/Repository');

module.exports = 
class BookmarksController extends require('./Controller') {
    constructor(req, res){
        super(req, res);
        this.bookmarksRepository = new Repository('bookmarks');
    }
    // GET: api/contacts
    // GET: api/contacts/{id}
	get(id,args){
	   if(args === undefined) {
		  if(!isNaN(id))
			 this.response.JSON(this.bookmarksRepository.get(id));
		  else
			 this.response.JSON(this.bookmarksRepository.getAll());
	   } 
	   else {
		  let parsedArgs = parseArgs(args);
		  let funcs = buildProcess(parsedArgs);
		  let src = this.bookmarksRepository.getAll();
		  for(let i = 0; i != funcs.length; ++i) {
			 src = funcs[i](src);
		  }
		  //this.response.JSON(src);
		  this.response.JSON(null);
	   }
	}	
    // POST: api/contacts body payload[{"Id": 0, "Name": "...", "Email": "...", "Phone": "..."}]
    post(bookmarks){  
        // todo : validate contact before insertion
        // todo : avoid duplicates
        let newBookmark = this.bookmarksRepository.add(bookmarks);
        if (newContact)
            this.response.created(newContact);
        else
            this.response.internalError();
    }
    // PUT: api/contacts body payload[{"Id":..., "Name": "...", "Email": "...", "Phone": "..."}]
    put(bookmarks){
        // todo : validate contact before updating
        if (this.bookmarksRepository.update(bookmarks))
            this.response.ok();
        else 
            this.response.notFound();
    }
    // DELETE: api/contacts/{id}
    remove(id){
        if (this.bookmarksRepository.remove(id))
            this.response.accepted();
        else
            this.response.notFound();
    }
}

class Pair {
   constructor(key, value) {
      this.key = key;
      this.value = value;
   }
}

function parseArgs(args) {
   let res = [];
   let debut = 0;
   let fin = args.indexOf('&');
   while (fin != -1 && debut != fin) {
      res.push(parseArgument(args.substr(debut, fin)));
      debut = fin + 1;
      fin = args.indexOf('&', debut);
   }
   res.push(parseArgument(args.substr(debut, args.length)));
   return res;
}

function parseArgument(str) {
   let pos = str.indexOf('=');
   let key = cleanArgument(str.substr(0, pos));
   let value = cleanArgument(str.substr(pos + 1, str.length));
   return new Pair(key, value);
}

function deQuotify(s) {
   if(s == null || s.length <= 1) return s;
   let first = s[0];
   let last = s[s.length-1];
   if((first == '"' || last == '"') && first != last)
      throw "not well-formed quoted string";
   return first == '"'? s.substr(1, s.length - 2) : s;;
}

function cleanArgument(s) {
   return deQuotify(decodeURI(s).trim());
}

function buildProcess(pairs) {
   let funcs = [];
   for(let i = 0; i != pairs.length; ++i) {
      funcs.push(makeTransform(pairs[i].key, pairs[i].value));
   }
   return funcs;
}
function keepIf(val,member) {
   return function(lst) {
      let res = [];
      for(let i = 0; i != lst.length; ++i) {
         if(cleanArgument(member(lst[i])) === val) {
            res.push(lst[i]);
         }
      }
      return res;
   }
}
function keepName(name) {
   return function(lst) {
      let res = [];
      for(let i = 0; i != lst.length; ++i) {
         if(cleanArgument(lst[i].Name) === name) {
            res.push(lst[i]);
         }
      }
      return res;
   }
}