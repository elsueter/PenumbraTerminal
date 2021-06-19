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
        std::string out = "\r\n+--------------------------------------------+\r\n";
        out += "| ";
        for(auto &it: x[query]){
            out += it.s();
            out += " | ";
        }
        out += "\r\n+--------------------------------------------+\r\n";
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
        auto page = crow::mustache::load("index.html");
        
        return page.render();
    });
    
    //Other route lambda function (to be updated)
    CROW_ROUTE(app, "/gen")
    ([]{
        return crow::response(200);
    });
    
    CROW_ROUTE(app, "/del")
    ([]{
        return crow::response(200);
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

    //app.ssl_file("/etc/letsencrypt/live/elsueter.dev/fullchain.pem");

    app.port(18081).multithreaded().run();

    return 0;
}
