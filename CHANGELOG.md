# Changes in version 2.0

- **Parent module renamed to applica-framework from framework**

- **Removed web applications**
    Now, Framework application are only rest web services. All UI are developed in AJ-Framework

- **Default packaging is not war, but jar. Application is executed using spring boot**

- **SimpleResponse renamed to Response**
    Error and messages properties removed. responseCode int property added.

- **Added MVC test environment**

- **Services module**
    Each controller action use only service module to perform business logic.
    user <-> controller <-> services <-> data and domain

- **Added Log utility class to wrap logging**

- **Updated mongo driver**

- **Added possibility to force environment in options**

- ****