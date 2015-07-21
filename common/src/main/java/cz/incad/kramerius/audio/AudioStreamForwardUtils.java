package cz.incad.kramerius.audio;

import java.io.IOException;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.core.Response.ResponseBuilder;

import cz.incad.kramerius.ObjectPidsPath;
import cz.incad.kramerius.SolrAccess;
import cz.incad.kramerius.audio.jersey.JerseyAudioHttpRequestForwarder;
import cz.incad.kramerius.audio.servlets.ServletAudioHttpRequestForwarder;
import cz.incad.kramerius.audio.urlMapping.RepositoryUrlManager;
import cz.incad.kramerius.security.IsActionAllowed;
import cz.incad.kramerius.security.SecuredActions;
import cz.incad.kramerius.security.SecurityException;
import cz.incad.kramerius.security.User;

/**
 * Utility class for sharing funcionality between servlet and API point
 * @author pavels
 *
 */
public class AudioStreamForwardUtils {

    public static Logger LOGGER = Logger.getLogger(AudioStreamForwardUtils.class.getName());
    
    public static boolean canBeRead(String pid, SolrAccess sa, User user, IsActionAllowed actionAllowed) throws IOException {
        ObjectPidsPath[] paths = sa.getPath(pid);
        for (ObjectPidsPath pth : paths) {
            if (actionAllowed.isActionAllowed(user, SecuredActions.READ.getFormalName(), pid, null, pth)) {
                return true;
            }
        }
        return false;
    }

    
    
    
    public static ResponseBuilder GET(HttpServletRequest request,
            ResponseBuilder builder, SolrAccess solrAccess, User user, IsActionAllowed actionAllowed, RepositoryUrlManager urlManager) throws IOException {
        AudioStreamId id = AudioStreamId.fromPathInfo(request.getPathInfo());
        LOGGER.info(id.toString());
        if (canBeRead(id.getPid(), solrAccess, user, actionAllowed)) {
            try {
                URL url = urlManager.getAudiostreamRepositoryUrl(id);
                if (url == null) {
                    throw new IllegalArgumentException("url for id " + id.toString() + " is null");
                }
                LOGGER.info(url.toString());
                //appendTestHeaders(response, id, url); //testovaci hlavicky
                JerseyAudioHttpRequestForwarder forwarder = new JerseyAudioHttpRequestForwarder(request, builder);
                ResponseBuilder respBuilder = forwarder.forwardGetRequest(url);
                return respBuilder;
            } catch (URISyntaxException ex) {
                Logger.getLogger(AudioStreamForwardUtils.class.getName()).log(Level.SEVERE, null, ex);
                throw new IllegalArgumentException(ex);
            }
        } else {
            throw new SecurityException("not allowed");
        }
    
    }
    
    public static void GET(HttpServletRequest request,
            HttpServletResponse response, SolrAccess solrAccess, User user, IsActionAllowed actionAllowed, RepositoryUrlManager urlManager) throws IOException, ServletException {
        //TODO: tune logging levels (staci vetsinou FINE)
        LOGGER.log(Level.INFO, "GET {0}", request.getPathInfo());
        AudioStreamId id = AudioStreamId.fromPathInfo(request.getPathInfo());
        LOGGER.info(id.toString());
        if (canBeRead(id.getPid(), solrAccess, user, actionAllowed)) {
            try {
                URL url = urlManager.getAudiostreamRepositoryUrl(id);
                if (url == null) {
                    throw new ServletException("url for id " + id.toString() + " is null");
                }
                LOGGER.info(url.toString());
                //appendTestHeaders(response, id, url); //testovaci hlavicky
                ServletAudioHttpRequestForwarder forwarder = new ServletAudioHttpRequestForwarder(request, response);
                forwarder.forwardGetRequest(url);
            } catch (URISyntaxException ex) {
                Logger.getLogger(AudioStreamForwardUtils.class.getName()).log(Level.SEVERE, null, ex);
                throw new ServletException(ex);
            }
        } else {
            response.sendError(HttpServletResponse.SC_FORBIDDEN);
        }
    }

    public static void HEAD(HttpServletRequest request,
            HttpServletResponse response, SolrAccess solrAccess, User user, IsActionAllowed actionAllowed, RepositoryUrlManager urlManager) throws IOException, ServletException {
        LOGGER.log(Level.INFO, "HEAD {0}", request.getPathInfo());
        AudioStreamId id = AudioStreamId.fromPathInfo(request.getPathInfo());
        LOGGER.info(id.toString());
        if (canBeRead(id.getPid(),solrAccess, user, actionAllowed)) {
            try {
                URL url = urlManager.getAudiostreamRepositoryUrl(id);
                if (url == null) {
                    throw new ServletException("url for id " + id.toString() + " is null");
                }
                LOGGER.info(url.toString());
                //appendTestHeaders(response, id, url); //testovaci hlavicky
                ServletAudioHttpRequestForwarder forwarder = new ServletAudioHttpRequestForwarder(request, response);
                forwarder.forwardHeadRequest(url);
            } catch (URISyntaxException ex) {
                Logger.getLogger(AudioStreamForwardUtils.class.getName()).log(Level.SEVERE, null, ex);
                throw new ServletException(ex);
            }
        } else {
            response.sendError(HttpServletResponse.SC_FORBIDDEN);
        }
    }

    public static ResponseBuilder HEAD(HttpServletRequest request,
            ResponseBuilder builder, SolrAccess solrAccess, User user, IsActionAllowed actionAllowed, RepositoryUrlManager urlManager) throws IOException {
        LOGGER.log(Level.INFO, "HEAD {0}", request.getPathInfo());
        AudioStreamId id = AudioStreamId.fromPathInfo(request.getPathInfo());
        LOGGER.info(id.toString());
        if (canBeRead(id.getPid(),solrAccess, user, actionAllowed)) {
            try {
                URL url = urlManager.getAudiostreamRepositoryUrl(id);
                if (url == null) {
                    throw new IllegalArgumentException("url for id " + id.toString() + " is null");
                }
                //LOGGER.info(url.toString());
                //appendTestHeaders(response, id, url); //testovaci hlavicky
                JerseyAudioHttpRequestForwarder forwarder = new JerseyAudioHttpRequestForwarder(request, builder);
                return forwarder.forwardHeadRequest(url);
            } catch (URISyntaxException ex) {
                Logger.getLogger(AudioStreamForwardUtils.class.getName()).log(Level.SEVERE, null, ex);
                throw new IllegalArgumentException(ex);
            }
        } else {
            throw new SecurityException("not allowed");
        }
    }

}