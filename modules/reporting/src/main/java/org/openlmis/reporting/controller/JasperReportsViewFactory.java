/*
 * Copyright © 2013 VillageReach. All Rights Reserved. This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 *
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

package org.openlmis.reporting.controller;

import org.openlmis.core.domain.ReportTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.servlet.view.jasperreports.AbstractJasperReportsSingleFormatView;

import javax.annotation.Resource;
import javax.sql.DataSource;
import java.io.File;
import java.io.IOException;
import java.util.Map;

import static java.io.File.createTempFile;
import static org.apache.commons.io.FileUtils.writeByteArrayToFile;
import static org.springframework.web.context.ContextLoader.getCurrentWebApplicationContext;

@Service
public class JasperReportsViewFactory {

  public static final String PDF_VIEW = "pdf";

  @Autowired
  DataSource replicationDataSource;

  @Resource
  Map<String, AbstractJasperReportsSingleFormatView> jasperViews;

  public AbstractJasperReportsSingleFormatView getJasperReportsView(ReportTemplate reportTemplate, String format) throws IOException {
    String viewFormat = format == null ? PDF_VIEW : format;

    AbstractJasperReportsSingleFormatView jasperView = jasperViews.get(viewFormat);

    setDataSourceAndURLAndApplicationContext(reportTemplate, jasperView);

    return jasperView;
  }

  private void setDataSourceAndURLAndApplicationContext(ReportTemplate reportTemplate, AbstractJasperReportsSingleFormatView jasperView) throws IOException {
    WebApplicationContext ctx = getCurrentWebApplicationContext();

    jasperView.setJdbcDataSource(replicationDataSource);
    jasperView.setUrl(getReportURLForReportData(reportTemplate));

    if (ctx != null)
      jasperView.setApplicationContext(ctx);
  }

  public String getReportURLForReportData(ReportTemplate reportTemplate) throws IOException {
    File tmpFile = createTempFile(reportTemplate.getName(), ".jrxml");
    writeByteArrayToFile(tmpFile, reportTemplate.getData());
    return tmpFile.toURI().toURL().toString();
  }
}