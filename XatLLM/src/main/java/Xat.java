import java.io.IOException;
import java.util.concurrent.TimeUnit;

import org.json.JSONObject;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * Servlet implementation class Xat
 */
@WebServlet("/Xat")
public class Xat extends HttpServlet {
    private static final long serialVersionUID = 1L;

    /**
     * Default constructor. 
     */
    public Xat() {
        // TODO Auto-generated constructor stub
    }

    /**
     * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
     */
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String mail = request.getParameter("mail");
        String session = request.getParameter("session");

        System.out.println( mail + " " + session);

        User u = new User();
        u.setMail(mail);
        u.setSession(session);

        Missatge sms=null;
        if (u.isLogged()) {
            System.out.println("entro");
            sms = new Missatge();
            sms.setReceptor(mail);
            do {
                System.out.println("entro do while");
                try {
                    TimeUnit.SECONDS.sleep((long)1);
                } catch (InterruptedException e) {
                    System.out.println("Error al sleep");
                }
                sms.getMissatge();
            }while(sms.getText()==null);
        }
        System.out.println("generando json....");
        JSONObject json = new JSONObject(sms);
        String stringJson = json.toString();
        // Permitir solicitudes desde cualquier origen
        response.setHeader("Access-Control-Allow-Origin", "*");

        // Otros encabezados CORS opcionales
        response.setHeader("Access-Control-Allow-Methods", "GET");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
        response.getWriter().append(stringJson);
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String mail = request.getParameter("mail");
        String session = request.getParameter("session");
        String receptor = request.getParameter("receptor");
        String text = request.getParameter("sms");

        System.out.println( mail +" " +session+ " "+ receptor + " " + text );

        User u = new User();
        u.setMail(mail);
        u.setSession(session);

        Missatge sms = null;
        if (u.isLogged()) {
            sms = new Missatge();
            sms.setReceptor(receptor);
            sms.setText(text);
            sms.setEmisor(mail);
            sms.guardar();
        }
        // Permitir solicitudes desde cualquier origen
        response.setHeader("Access-Control-Allow-Origin", "*");

        // Otros encabezados CORS opcionales
        response.setHeader("Access-Control-Allow-Methods", "GET");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
        response.getWriter().append("0");
    }
}