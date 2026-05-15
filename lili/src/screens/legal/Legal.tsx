import {useNavigate} from "react-router-dom";
import "./Legal.css";
import { Layout } from "../Layout.tsx";

const Legal = () => {
    
    const navigate = useNavigate();
    
    return <Layout>
        <div className="contenido">
            <div className="migas">Legal</div>
            <button onClick={() => navigate(-1)} className="volver">Volver</button>
            <div className="secciones">
                <h1>Términos de servicio</h1>
                <section className="legal">
                    <h2>Términos de Servicio</h2>
                    <p>Al usar Lili, aceptas quedar sujeto a los siguientes términos y condiciones ("Términos de servicio").</p>
                    <p>Lili se reserva el derecho de actualizar y cambiar los Términos de Servicio de vez en cuando, sin previo aviso. Cualquier característica nueva que aumente o mejore el Servicio actual, incluyendo el lanzamiento de nuevas herramientas y recursos, estará sujeta a los Términos de Servicio. El uso continuado del Servicio después de dichos cambios constituirá tu consentimiento a dichos cambios. Puedes revisar la versión más actual de los Términos de Servicio en cualquier momento en: https://lili.com/legal.</p>
                    <p>La violación de cualquiera de los términos a continuación resultará en la terminación de tu cuenta. Aunque Lili prohíbe dicha conducta y contenido en el Servicio, entiendes y aceptas que Lili no puede ser responsable del contenido publicado en el Servicio y, sin embargo, podrías estar expuesto a dichos materiales. Aceptas utilizar el Servicio bajo tu propio riesgo.</p>
                    <p>Lili se reserva el derecho de actualizar y cambiar los Términos de Servicio de vez en cuando, sin previo aviso. Cualquier característica nueva que aumente o mejore el Servicio actual, incluyendo el lanzamiento de nuevas herramientas y recursos, estará sujeta a los Términos de Servicio. El uso continuado del Servicio después de dichos cambios constituirá tu consentimiento a dichos cambios. Puedes revisar la versión más actual de los Términos de Servicio en cualquier momento en: https://lili.com/legal.</p>
                    <h2>Términos de la Cuenta</h2>
                    <p>Debes proporcionar y mantener una dirección de correo electrónico válida, junto con cualquier otra información solicitada para completar el proceso de registro y mantener el Servicio.
                        Eres responsable de mantener la seguridad de tu cuenta y contraseña. Lili no puede y no será responsable por ninguna pérdida o daño debido a tu incumplimiento de esta obligación de seguridad.
                        Debes tener 13 años o más para utilizar este Servicio.
                        Eres responsable de todo el contenido asociado a tu cuenta.
                        Debes ser humano. Las cuentas registradas por "bots" u otros métodos automatizados no están permitidas.
                        No puedes usar el Servicio para ningún propósito ilegal o no autorizado. No debes, en el uso del Servicio, violar ninguna ley en tu jurisdicción.</p>
                    <h2>Cancelación y Terminación</h2>
                    <p>Puedes eliminar tu cuenta en cualquier momento poniéndote en contacto con la administración desde la sección Contacto en https://lili.com/contacto.
                        Todo su contenido será inaccesible (y no se podrá recuperar) del Servicio al finalizar.
                        Dentro de 90 días, todo el contenido se eliminará permanentemente de las copias de seguridad y los registros.
                        Tu terminación tendrá efecto inmediato.
                        Nos reservamos el derecho de terminar el acceso si determinamos que lo estás utilizando para fines organizacionales o comerciales.
                        Lili se reserva el derecho de terminar una cuenta o rechazar el servicio a cualquier persona por cualquier motivo en cualquier momento.</p>
                    <h2>Modificaciones al servicio</h2>
                    <p>Lili se reserva el derecho en cualquier momento de modificar o descontinuar el Servicio (o cualquier parte del mismo) con o sin previo aviso.
                        Lili no será responsable ante ti o ante terceros por cualquier modificación, suspensión o descontinuación del Servicio.</p>
                    <h2>Términos generales</h2>
                    <p>El uso del Servicio es bajo tu propio riesgo. El servicio se proporciona "tal cual" y "según disponibilidad".
                        El soporte técnico se proporciona únicamente por correo electrónico.
                        No debes modificar, adaptar o hackear el Servicio.
                        El abuso verbal, físico, escrito u otro (incluyendo amenazas de abuso o represalias) a cualquier agente de servicio a cliente, empleado o funcionario de la Compañía resultará en la terminación inmediata de la cuenta.
                        Lili no garantiza que (i) el servicio cumplirá con tus requisitos específicos, (ii) el servicio será ininterrumpido, oportuno, seguro o libre de errores, (iii) los resultados que se puedan obtener del uso del servicio serán precisos o confiables, (iv) la calidad de cualquier producto, servicio, información u otro material obtenido por ti a través del servicio cumplirá con tus expectativas, y (v) se corregirán los errores en el Servicio.
                        El hecho de que Lili no ejerza o haga cumplir cualquier derecho o disposición de los Términos de Servicio no constituirá una renuncia a dicho derecho o disposición. Los Términos de Servicio constituyen el acuerdo completo entre tú y Lili y rigen tu uso del Servicio, reemplazando cualquier acuerdo previo entre tú y Lili (incluyendo, pero no limitado a, cualquier versión anterior de los Términos de Servicio).
                        No hagas nada abusivo o ilegal.</p>
                </section>

                <h1>Política de privacidad</h1>
                <section className="legal">
                    <h2>¿Qué información recopilamos?</h2>
                    <p>Recopilamos tu información cuando te registras en nuestro sitio o nos contactas.</p>
                    <p>Al registrarte en nuestro sitio, según corresponda, se te puede pedir que ingreses tu: nombre de usuario o dirección de correo electrónico.</p>
                    <h2>¿Para qué utilizamos tu información?</h2>
                    <p>Cualquiera de la información que recopilamos de ti puede ser utilizada de las siguientes maneras:</p>
                        <li>Para personalizar tu experiencia</li>
                        <li>Tu información nos ayuda a responder mejor a tus necesidades individuales.</li>
                        <li>Para mejorar nuestro sitio web</li>
                        <li>Nos esforzamos continuamente por mejorar nuestros servicios en el sitio web basándonos en la información y los comentarios que recibimos de ti.</li>
                        <li>Para mejorar el servicio al cliente</li>
                        <li>Tu información nos ayuda a responder de manera más efectiva a tus solicitudes de servicio al cliente y necesidades de soporte.</li>
                        <li>Tu información, ya sea pública o privada, no será vendida, intercambiada, transferida ni entregada a ninguna otra compañía por ningún motivo, sin tu consentimiento, salvo para el propósito expreso de entregar el producto o servicio solicitado.</li>
                    <h2>¿Qué análisis se utilizan?</h2>
                        <p>Ninguno.</p>
                    <h2>Cookies</h2>
                    <p>Usamos cookies con el propósito limitado de iniciar tu sesión y mantenerte conectado entre visitas. No usamos cookies para fines de seguimiento o análisis.</p>
                    <h2>¿Divulgamos alguna información a terceros?</h2>
                    <p>No vendemos, comercializamos ni transferimos de otro modo a terceros tu información personal identificable. Esto no incluye a terceros de confianza que nos ayuden a operar nuestro sitio web, realizar nuestro negocio o prestarte servicios, siempre que esas partes acuerden mantener esta información confidencial. También podemos divulgar tu información cuando creamos que es apropiado para cumplir con la ley, hacer cumplir nuestras políticas del sitio o proteger nuestros derechos, propiedad o seguridad, o los de otros. Sin embargo, la información de los visitantes que no es personalmente identificable puede proporcionarse a otras partes para marketing, publicidad u otros usos.</p>
                    <h2>Enlaces de terceros</h2>
                    <p>Ocasionalmente, a nuestra discreción, podemos incluir u ofrecer productos o servicios de terceros en nuestro sitio web. Estos sitios de terceros tienen políticas de privacidad separadas e independientes. Por lo tanto, no tenemos responsabilidad alguna por el contenido y las actividades de estos sitios vinculados. No obstante, buscamos proteger la integridad de nuestro sitio y agradecemos cualquier comentario sobre estos sitios.</p>
                    <h2>Cumplimiento de la Ley de Protección de la Privacidad en Línea de los Niños</h2>
                    <p>Cumplimos con los requisitos de COPPA (Ley de Protección de la Privacidad Infantil en Línea), no recopilamos ninguna información de personas menores de 13 años. Nuestro sitio web, productos y servicios están dirigidos a personas de al menos 13 años o más.</p>
                    <h2>Tu consentimiento</h2>
                    <p>Al usar nuestro sitio, aceptas nuestro política de privacidad.</p>
                    <h2>Cambios</h2>
                    <p>Puedes determinar cuándo se revisó por última vez esta Política de Privacidad consultando la fecha de "ÚLTIMA ACTUALIZACIÓN" en la parte inferior de esta sección.</p>
                    <p>https://www.lili.com/contacto</p>
                    <p>ÚLTIMA ACTUALIZACIÓN: 1/10/2026</p>
                </section>

                <h1>Política de seguridad</h1>
                <section className="legal">
                    <h2>Protegemos tus datos</h2>
                    <p>Todos los datos se escriben en varios discos al instante, se respaldan diariamente y los respaldos se almacenan en varios lugares.</p>
                    <h2>Infraestructura actualizada regularmente</h2>
                    <p>Nuestra infraestructura de software se actualiza regularmente con los últimos parches de seguridad. Nuestros productos funcionan en una red con cortafuegos y se monitorean cuidadosamente. Aunque la seguridad perfecta es un objetivo en constante cambio, trabajamos arduamente para mantenernos al día con lo último en seguridad web.</p>
                    <h2>Tus datos a través de HTTPS.</h2>
                    <p>Siempre que tus datos están en tránsito entre tú y nosotros, todo está cifrado y se envía utilizando HTTPS. Tus datos también están cifrados en reposo.</p>
                </section>
            </div>
        </div>
    </Layout>
}

export default Legal;