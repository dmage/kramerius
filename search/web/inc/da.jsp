<%@ page contentType="text/html" pageEncoding="UTF-8" %>
<%@ page trimDirectiveWhitespaces="true"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/xml" prefix="x" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>
<%@ page isELIgnored="false"%>
<%@page import="com.google.inject.Injector"%>
<%@page import="java.util.Locale"%>
<%@page import="com.google.inject.Provider"%>
<%@page import="cz.incad.Kramerius.backend.guice.LocalesProvider"%>
<%@page import="java.io.*, cz.incad.kramerius.service.*"  %>
<%@page import="cz.incad.kramerius.utils.conf.KConfiguration"%>
<%@page import="javax.servlet.jsp.jstl.fmt.LocalizationContext"%>
<%@page import="cz.incad.kramerius.FedoraAccess"%>
<%
    XSLService xsda = (XSLService) ctxInj.getInstance(XSLService.class);
    try {
        String xsl = "da.xsl";
        if (xsda.isAvailable(xsl)) {
            String text = xsda.transform(xml, xsl, lctx.getLocale());
            out.println(text);
            return;
        }
    } catch (Exception e) {
        out.println(e);
        out.println(xml);
    }
%>
<c:catch var="exceptions">
    <c:url var="facetxslurl" value="inc/results/xsl/da.xsl" />
    <c:import url="${facetxslurl}" var="facetxsl" charEncoding="UTF-8"  />

<div id="selectDiv" class="da_select" style="display:none;" ></div>

<div id="da-inputs">
<fmt:message bundle="${lctx}">Od</fmt:message>: <input class="da_input" id="f1" size="10" type="text" value="" />
<fmt:message bundle="${lctx}">Do</fmt:message>: <input class="da_input" id="f2" size="10" type="text" value=""  /> 
<a href="javascript:doFilter();" ><img align="top" src="img/lupa_orange.png" border="0" alt="<fmt:message bundle="${lctx}">použit</fmt:message>" title="<fmt:message bundle="${lctx}">použit</fmt:message>" /></a>
</div>
<div id="content-resizable" style="position:relative;float:none;">
<div id="content-scroll" style="float:left;" >
    <div class="da_container" id="da_container">
<div id="select-handle-top" class="da_select_handle" ><img src="img/resize.png" style="top:-4px;position:absolute;left:0px;" /></div>
<div id="select-handle-bottom" class="da_select_handle"><img src="img/resize.png" style="top:-4px;position:absolute;left:0px;" /></div>
<div id="resizable-top" class="ui-state-active da_resizable"></div>
<div id="resizable-bottom" class="ui-state-active da_resizable"></div>
<div id="bubbleDiv" class="da_bubble" ><div id="bubbleText" ></div></div>
<div id="img_resize_bottom" class="da_resize"></div>
<div id="img_resize_top" class="da_resize"></div>
<div id="constraint_bottom" class="da_constraint" ></div>
<div id="constraint_top" class="da_constraint" style="top:0px;left:0px;" ></div>
    <x:transform doc="${xml}"  xslt="${facetxsl}">
        <x:param name="bundle_url" value="${i18nServlet}"/>
    </x:transform>
    </div>
</div>
</div><div class="clear"></div>


<script>
    
    var times = new Array();
    var sizes = new Array();
    var maximums = new Array();
    var level = 0;
    var levels = 1;
    var shortMonths= ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var longMonths= ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var shortDays= ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    var longDays= ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    //var showStaticAxis = true;
    var maxCount;
  
    $(document).ready(function(){
        if(number_of_items<2){
            $("#dadiv").remove();
            return;
        }
        dateAxisActive = true;
        var a = new Array();
        $(".da_group").each(function(){
            var id = $(this).attr("id").split("_")[2];
            a[id + "0"] = [0, id + "0", id + "9"];
        });
        times[0] = a;
        
        var a2 = new Array();
        $(".da_bar").each(function(){
            var id = $(this).attr("id").split("_")[2];
            a2[id] = [0, id, id];
        });
        times[1] = a2;
        
        $(".da_bar_container").bind("mouseover", function(){
            var l = $(this).width()+$("#content-scroll").offset().left;
            var id = $(this).attr("id").split("_")[3];
            $("#bubbleDiv").css("left", l+ "px");
            $("#bubbleDiv").css("top", ($(this).offset().top-25) + "px");
            $("#bubbleText").html(id + " (" + $(this).text() + ")");
        });
        
        $(".da_bar_container").bind("mouseout", hideBubble);
        
        $(".da_bar_container").bind("click", function(){
            var id = $(this).attr("id").split("_")[3];
            //$("#" + fromField).val(formatDate(id));
            //$("#" + toField).val(formatDate(id));
            $("#" + fromField).val("01.01."+id);
            $("#" + toField).val("12.31."+id);
            if($(this).text()=="0"){
                return;
            }
            doFilter();
        });
        
        $("#select-handle-top").draggable({
            containment: '#constraint_bottom',
            axis:'y',
            drag: selectHandleChangeTop,
            stop: setSelectContainmentBottom
        });
        $("#select-handle-bottom").draggable({
            containment: '#constraint_top',
            axis:'y',
            drag: selectHandleChangeBottom,
            stop: setSelectContainmentTop
        });
        $("#content-scroll").bind('scroll', function() {
            daScrolled();
        });
      
        initDateAxis();
        $("#content-resizable").css("height", (containerHeight+7) + "px");
        daScrollToMax();

    });
</script>


</c:catch>
<c:choose>
    <c:when test="${exceptions != null}">
        <c:out value="${exceptions}" />
    </c:when>
</c:choose>