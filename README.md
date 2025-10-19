# AI Job Recommendation System

**An AI recommendation system that helps users get the jobs they are qualified for without going through the stress and hassle of sifting through tons of irrelevant jobs. Users can get AI recommendations straight to their emails. It uses MySQL with Sequelize ORM, JWT authentication, account verification, password recovery, job cache and rate limiter.**

 ## Pino Log Levels
Pino adheres to a standard severity model where each log level corresponds to a numeric value. This system is crucial for filtering logs efficiently, especially in production environments.

Logs are processed only if their level is equal to or higher (more severe) than the level configured for the logger or its targets.

| Level Name | Numeric Value | Use Case |
| :--- | :--- | :--- |
| trace	| 10	| Debugging: Extremely detailed information, often including variable states and internal function flow. |
| debug	| 20	| Debugging: Informational events useful for developers during active development and troubleshooting. |
| info	| 30	| Standard Activity (Default): Routine confirmation that application units are operating normally (e.g., Server started, Database connected). |
| warn	| 40	| Non-Critical Issues: Potential problems that don't immediately halt execution (e.g., deprecated API use, high-latency request). |
| error	| 50	| Errors: Runtime exceptions or issues that require immediate attention but might allow the application to continue running. | 
| fatal	| 60	| Critical Failure: Severe errors that cause the application to crash or become unusable. | 


Example usage

Instead of 
```javascript
console.log(`Server started on ${port}`)
```
You can use

```javascript
logger.info(`Server started on ${port}`)
```
*The log will be saved in the app.logs file and also outputted in the console.*

