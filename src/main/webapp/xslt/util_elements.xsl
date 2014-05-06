<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:cts="http://chs.harvard.edu/xmlns/cts" xmlns:dc="http://purl.org/dc/elements/1.1" xmlns:tei="http://www.tei-c.org/ns/1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:output omit-xml-declaration="yes" method="html" encoding="UTF-8"/>

	<!-- Framework for main body of document -->
	<xsl:template match="/">
        <html>
            <ul>
                <xsl:for-each select="//xsl:template">
                    <xsl:sort select="@match"/>
                    <li><xsl:value-of select="current()/@match"/></li>
                </xsl:for-each>
            </ul>
        </html>
	</xsl:template>
    
  
	

</xsl:stylesheet>
