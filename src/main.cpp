//#define CROW_ENABLE_SSL
#define CROW_MAIN

#include <crow.h>
#include <string>
#include <fstream>
#include <iostream>

std::string parseFile(std::string query){
    std::ifstream ifs("missions.json");
    std::string content( (std::istreambuf_iterator<char>(ifs) ),
                       (std::istreambuf_iterator<char>()    ) );

    crow::json::rvalue x = crow::json::load(content);

    if(query == "missions"){
        std::string out = "\r\n+-";
        for(auto &it: x[query]){
            for(auto& it2: it.s()){
                out += "-";
            }
            out += "-+-";
        }
        out = out.substr(0, out.length()-1);
        out += "\r\n| ";
        for(auto &it: x[query]){
            out += it.s();
            out += " | ";
        }
        out += "\r\n+-";
        for(auto &it: x[query]){
            for(auto& it2: it.s()){
                out += "-";
            }
            out += "-+-";
        }
        out = out.substr(0, out.length()-1);
        return out;
    }else if(x.has(query)){
        std::string out = "";
        for(auto &it: x[query]){
            out += it.s();
        }
        return out;
    }
    return "\r\nNot Found";
}

//Main -----------------------------------------------

int main(){

    //Crow app and routing lambda functions (Web Server)
    crow::SimpleApp app;
    
    //Base request and main page fetch
    crow::mustache::set_base(".");
    CROW_ROUTE(app,"/")
    ([]{
        crow::mustache::context ctx;
        auto page = crow::mustache::load("webApp/index.html");
        
        return page.render();
    });

    CROW_ROUTE(app,"/xtermCSS")
    ([](const crow::request&, crow::response& res){
        res.set_static_file_info("node_modules/xterm/css/xterm.css");
        res.end();
    });
    CROW_ROUTE(app,"/xtermJS")
    ([](const crow::request&, crow::response& res){
        res.set_static_file_info("node_modules/xterm/lib/xterm.js");
        res.end();
    });
    CROW_ROUTE(app,"/xterm.js.map")
    ([](const crow::request&, crow::response& res){
        res.set_static_file_info("node_modules/xterm/lib/xterm.js.map");
        res.end();
    });

    CROW_ROUTE(app,"/CSS")
    ([](const crow::request&, crow::response& res){
        res.set_static_file_info("webApp/index.css");
        res.end();
    });
    CROW_ROUTE(app,"/JS")
    ([](const crow::request&, crow::response& res){
        res.set_static_file_info("webApp/index.js");
        res.end();
    });

    CROW_ROUTE(app, "/fetch")
    .methods("POST"_method)
    ([](const crow::request& req){
        auto x = crow::json::load(req.body);
        if (!x)
            return crow::response(400);
        crow::json::wvalue y;
        y["data"] = parseFile(x.s());
        return crow::response(y);
    });

    app.port(18081).multithreaded().run();

    return 0;
}
