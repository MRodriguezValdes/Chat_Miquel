import java.io.IOException;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * Servlet implementation class Friend
 */
@WebServlet("/Friend")
public class Friend extends HttpServlet {
    private static final long serialVersionUID = 1L;

    public Friend() {
        // TODO Auto-generated constructor stub
    }
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String mail = request.getParameter("mail");
        String session = request.getParameter("session");
        String friendMail = request.getParameter("friend");

        System.out.println(mail + " " + session + " " + friendMail);

        User u = new User();
        u.setMail(mail);
        u.setSession(session);

        String resposta="0";
        //Codi resposta
        //0 El Servidor no respon
        //1 Amic afegit
        //2 Amic no trobat
        //3 Usuari necessita loggin

        if (u.isLogged()) {
            User friend = new User();
            friend.load(friendMail);
            if (friend.getUser()!=null) {
                if (u.setFriend(friend)) {
                    resposta="1";
                }
            }else {
                resposta="2";
            }
        }else {
            resposta = "3";
        }
        // Permitir solicitudes desde cualquier origen
        response.setHeader("Access-Control-Allow-Origin", "*");

        // Otros encabezados CORS opcionales
        response.setHeader("Access-Control-Allow-Methods", "GET");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
        response.getWriter().append(resposta);
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String mail = request.getParameter("mail");
        String session = request.getParameter("session");

        User u = new User();
        u.setMail(mail);
        u.setSession(session);

        String resposta ="[]";

        if (u.isLogged()) {
            resposta = u.getFriends();
        }
        // Permitir solicitudes desde cualquier origen
        response.setHeader("Access-Control-Allow-Origin", "*");

        // Otros encabezados CORS opcionales
        response.setHeader("Access-Control-Allow-Methods", "GET");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
        response.getWriter().append(resposta);
    }
}
