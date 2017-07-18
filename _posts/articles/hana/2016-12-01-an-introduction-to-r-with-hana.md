---
layout: post
title: An Introduction to R with SAP HANA
excerpt: "An Introduction to R with SAP HANA"
modified: 2016-12-01T17:00:00-00:00
categories: articles
tags: [R, HANA]
image:
  feature: /images/hana/masthead-abap-for-hana.jpg
comments: true
share: true
references:
  - title: "SAP HANA R Integration Guide"
    url: "http://help.sap.com/hana/SAP_HANA_R_Integration_Guide_en.pdf"
---

* TOC
{:toc}

## R language introduce
[R language][r-project] is is an [GNU][gnu] project which based on [S language][S_programming_language], it can be treated as an implementation of S language. It is firstly developed by Ross lhaka and Robert Gentleman in the University of Auckland, New Zealand, it mainly used for statistic computing, graphing, and data mining.

 Since SAP HANA SP5, it is has been enforced greatly with the integrate of memory computing and the statistic function of R language. This enables you use R as a procedure language, and call the function of R. The data exchange between SAP HANA and R is very efficient, because they all use the column storage style.  The communication process between SAP HANA and R is shown below:

![communication process between SAP HANA and R](/images/hana/r/hana-with-r-arc.png)

In order to execute R code in SAP HANA, the R code is writen as a procedure with RLANG. It is executed by the external Rserve.For the support of R operator, The calculate engine inside SAP HANA has been extended, for the given input object, after some computing , output with a result table. Differently with the local operator, R operator can be processed by R function, when the calculate engine recognized the R operator, the R client will send a request to the Rserve, and at the same time send the parameters needed by the program, then it will begin to execute, and result data frame will be send back to the calculate engine.

## The installation of R

[SAP HANA R Integration Guide][SAP_HANA_R_Integration_Guide]

## Samples

```sql
set schema "<your_schema>";

DROP TABLE "spam"
;
CREATE COLUMN TABLE "spam"("make" DOUBLE, "address" DOUBLE, "all" DOUBLE, "num3d" DOUBLE, "our" DOUBLE, "over" DOUBLE, "remove" DOUBLE, "internet" DOUBLE, "order" DOUBLE, "mail" DOUBLE, "receive" DOUBLE, "will" DOUBLE, "people" DOUBLE, "report" DOUBLE, "addresses" DOUBLE, "free" DOUBLE, "business" DOUBLE, "email" DOUBLE, "you" DOUBLE, "credit" DOUBLE, "your" DOUBLE, "font" DOUBLE, "num000" DOUBLE, "money" DOUBLE, "hp" DOUBLE, "hpl" DOUBLE, "george" DOUBLE, "num650" DOUBLE, "lab" DOUBLE, "labs" DOUBLE, "telnet" DOUBLE, "num857" DOUBLE, "data" DOUBLE, "num415" DOUBLE, "num85" DOUBLE, "technology" DOUBLE, "num1999" DOUBLE, "parts" DOUBLE, "pm" DOUBLE, "direct" DOUBLE, "cs" DOUBLE,"meeting" DOUBLE, "original" DOUBLE, "project" DOUBLE, "re" DOUBLE, "edu" DOUBLE, "table" DOUBLE, "conference" DOUBLE, "charSemicolon" DOUBLE, "charRoundbracket" DOUBLE, "charSquarebracket" DOUBLE, "charExclamation" DOUBLE, "charDollar" DOUBLE, "charHash" DOUBLE, "capitalAve" DOUBLE, "capitalLong" DOUBLE, "capitalTotal" DOUBLE, "type" VARCHAR(5000), "group" INTEGER)
;
DROP PROCEDURE LOAD_SPAMDATA
;
CREATE PROCEDURE LOAD_SPAMDATA(OUT spam "spam") LANGUAGE RLANG AS
BEGIN
 ##--if the kernlab package is missing see Requirements
 library(kernlab)
 data(spam)
 ind <- sample(1:dim(spam)[1], 2500)
 group <- as.integer(c(1:dim(spam)[1]) %in% ind) spam <- cbind(spam, group)
END
;
DROP TABLE "spamTraining"
;
DROP TABLE "spamEval"
;
CREATE COLUMN TABLE "spamTraining" like "spam"
;
CREATE COLUMN TABLE "spamEval" like "spam"
;
DROP PROCEDURE DIVIDE_SPAMDATA
;
CREATE PROCEDURE DIVIDE_SPAMDATA() AS
BEGIN CALL LOAD_SPAMDATA(spam)
;
Insert
into "spamTraining" select
	 *
from :spam
where "group"=1
;
Insert
into "spamEval" select
	 *
from :spam
where "group"=0
;

END
;
CALL DIVIDE_SPAMDATA()
;
Alter Table "spamTraining" DROP ("group")
;
Alter Table "spamEval" DROP ("group")
;
```




[r-project]:https://www.r-project.org/
[gnu]:https://www.gnu.org/home.en.html
[S_programming_language]:https://en.wikipedia.org/wiki/S_(programming_language)
[tutorialspoint-r]:http://www.tutorialspoint.com/r/
[codeschool-tryr]:http://tryr.codeschool.com/
[cyclismo-r]:http://www.cyclismo.org/tutorial/R/
[r-project-intro]:https://cran.r-project.org/doc/manuals/R-intro.html

[SAP_HANA_R_Integration_Guide]:http://help.sap.com/hana/SAP_HANA_R_Integration_Guide_en.pdf
[SAP_HANA_Predictive_Analysis_Library_PAL]:http://help.sap.com/hana/SAP_HANA_Predictive_Analysis_Library_PAL_en.pdf

[kramdown]:http://kramdown.gettalong.org/index.html
