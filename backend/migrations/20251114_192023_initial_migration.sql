/**
 * Database Migration
 * Generated: 2025-11-14T19:20:23.023Z
 * Timestamp: 20251114_192023
 *
 * This migration includes:
 * - Schema structures (tables, indexes, constraints)
 * - Initial data
 * - Stored procedures
 *
 * Note: This file is automatically executed by the migration runner
 * on application startup in Azure App Service.
 */

-- Set options for better SQL Server compatibility
SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
SET ANSI_PADDING ON;
SET CONCAT_NULL_YIELDS_NULL ON;
SET ANSI_WARNINGS ON;
SET NUMERIC_ROUNDABORT OFF;
GO

PRINT 'Starting database migration...';
PRINT 'Timestamp: 20251114_192023';
GO


-- ============================================
-- STRUCTURE
-- Database schemas, tables, indexes, and constraints
-- ============================================

-- File: subscription/_structure.sql
/**
 * @schema subscription
 * Subscription and account management schema
 */
CREATE SCHEMA [subscription];
GO

/**
 * @table account Account management for multi-tenancy
 * @multitenancy false
 * @softDelete false
 * @alias acc
 */
CREATE TABLE [subscription].[account] (
  [idAccount] INTEGER IDENTITY(1, 1) NOT NULL,
  [name] NVARCHAR(200) NOT NULL,
  [dateCreated] DATETIME2 NOT NULL,
  [active] BIT NOT NULL
);
GO

/**
 * @primaryKey pkAccount
 * @keyType Object
 */
ALTER TABLE [subscription].[account]
ADD CONSTRAINT [pkAccount] PRIMARY KEY CLUSTERED ([idAccount]);
GO

/**
 * @index ixAccount_Active Performance index for active accounts
 * @type Performance
 */
CREATE NONCLUSTERED INDEX [ixAccount_Active]
ON [subscription].[account]([active])
WHERE [active] = 1;
GO

-- File: functional/_structure.sql
/**
 * @schema functional
 * Business logic schema for NoteDB application
 */
CREATE SCHEMA [functional];
GO

/**
 * @table note Note storage table for user notes
 * @multitenancy true
 * @softDelete false
 * @alias nte
 */
CREATE TABLE [functional].[note] (
  [idNote] INTEGER IDENTITY(1, 1) NOT NULL,
  [idAccount] INTEGER NOT NULL,
  [titulo] NVARCHAR(100) NOT NULL,
  [conteudo] NVARCHAR(MAX) NOT NULL,
  [cor] VARCHAR(50) NOT NULL,
  [dateCreated] DATETIME2 NOT NULL,
  [dateModified] DATETIME2 NOT NULL
);
GO

/**
 * @primaryKey pkNote
 * @keyType Object
 */
ALTER TABLE [functional].[note]
ADD CONSTRAINT [pkNote] PRIMARY KEY CLUSTERED ([idNote]);
GO

/**
 * @foreignKey fkNote_Account Account isolation for multi-tenancy
 * @target subscription.account
 * @tenancy true
 */
ALTER TABLE [functional].[note]
ADD CONSTRAINT [fkNote_Account] FOREIGN KEY ([idAccount])
REFERENCES [subscription].[account]([idAccount]);
GO

/**
 * @check chkNote_TituloLength Validates titulo length constraints
 */
ALTER TABLE [functional].[note]
ADD CONSTRAINT [chkNote_TituloLength] CHECK (LEN([titulo]) >= 3 AND LEN([titulo]) <= 100);
GO

/**
 * @check chkNote_ConteudoLength Validates conteudo length constraints
 */
ALTER TABLE [functional].[note]
ADD CONSTRAINT [chkNote_ConteudoLength] CHECK (LEN([conteudo]) >= 1 AND LEN([conteudo]) <= 5000);
GO

/**
 * @index ixNote_Account Account-based filtering for multi-tenancy
 * @type ForeignKey
 */
CREATE NONCLUSTERED INDEX [ixNote_Account]
ON [functional].[note]([idAccount]);
GO

/**
 * @index ixNote_Account_DateModified Performance index for listing notes by modification date
 * @type Performance
 */
CREATE NONCLUSTERED INDEX [ixNote_Account_DateModified]
ON [functional].[note]([idAccount], [dateModified] DESC)
INCLUDE ([titulo], [cor]);
GO

/**
 * @index ixNote_Account_Cor Performance index for filtering notes by color
 * @type Search
 */
CREATE NONCLUSTERED INDEX [ixNote_Account_Cor]
ON [functional].[note]([idAccount], [cor])
INCLUDE ([titulo], [dateModified]);
GO


-- ============================================
-- DATA
-- Initial data and configuration
-- ============================================

-- File: subscription/_data.sql
/**
 * @load account
 */
INSERT INTO [subscription].[account]
([name], [dateCreated], [active])
VALUES
('Default Account', GETUTCDATE(), 1);
GO


-- ============================================
-- STORED PROCEDURES
-- Database stored procedures and functions
-- ============================================

-- File: functional/note/spNoteCreate.sql
/**
 * @summary
 * Creates a new note with titulo, conteudo, and optional cor.
 * Automatically generates dateCreated and dateModified timestamps.
 *
 * @procedure spNoteCreate
 * @schema functional
 * @type stored-procedure
 *
 * @endpoints
 * - POST /api/v1/internal/note
 *
 * @parameters
 * @param {INT} idAccount
 *   - Required: Yes
 *   - Description: Account identifier for multi-tenancy isolation
 *
 * @param {INT} idUser
 *   - Required: Yes
 *   - Description: User identifier for audit purposes
 *
 * @param {NVARCHAR(100)} titulo
 *   - Required: Yes
 *   - Description: Note title (3-100 characters)
 *
 * @param {NVARCHAR(MAX)} conteudo
 *   - Required: Yes
 *   - Description: Note content (1-5000 characters)
 *
 * @param {VARCHAR(50)} cor
 *   - Required: No
 *   - Description: Note color for visual organization (default: 'branco')
 *
 * @returns {INT} idNote - Identifier of the created note
 *
 * @testScenarios
 * - Valid creation with all required parameters
 * - Valid creation with optional cor parameter
 * - Validation failure for titulo length constraints
 * - Validation failure for conteudo length constraints
 * - Security validation with invalid account
 */
CREATE OR ALTER PROCEDURE [functional].[spNoteCreate]
  @idAccount INTEGER,
  @idUser INTEGER,
  @titulo NVARCHAR(100),
  @conteudo NVARCHAR(MAX),
  @cor VARCHAR(50) = 'branco'
AS
BEGIN
  SET NOCOUNT ON;

  /**
   * @validation Required parameter validation
   * @throw {idAccountRequired}
   */
  IF @idAccount IS NULL
  BEGIN
    ;THROW 51000, 'idAccountRequired', 1;
  END;

  /**
   * @validation Required parameter validation
   * @throw {idUserRequired}
   */
  IF @idUser IS NULL
  BEGIN
    ;THROW 51000, 'idUserRequired', 1;
  END;

  /**
   * @validation Required parameter validation
   * @throw {tituloRequired}
   */
  IF @titulo IS NULL OR LEN(@titulo) = 0
  BEGIN
    ;THROW 51000, 'tituloRequired', 1;
  END;

  /**
   * @validation Titulo length validation
   * @throw {tituloTooShort}
   */
  IF LEN(@titulo) < 3
  BEGIN
    ;THROW 51000, 'tituloTooShort', 1;
  END;

  /**
   * @validation Titulo length validation
   * @throw {tituloTooLong}
   */
  IF LEN(@titulo) > 100
  BEGIN
    ;THROW 51000, 'tituloTooLong', 1;
  END;

  /**
   * @validation Required parameter validation
   * @throw {conteudoRequired}
   */
  IF @conteudo IS NULL OR LEN(@conteudo) = 0
  BEGIN
    ;THROW 51000, 'conteudoRequired', 1;
  END;

  /**
   * @validation Conteudo length validation
   * @throw {conteudoTooLong}
   */
  IF LEN(@conteudo) > 5000
  BEGIN
    ;THROW 51000, 'conteudoTooLong', 1;
  END;

  /**
   * @validation Account existence validation
   * @throw {accountDoesntExist}
   */
  IF NOT EXISTS (SELECT * FROM [subscription].[account] acc WHERE acc.[idAccount] = @idAccount)
  BEGIN
    ;THROW 51000, 'accountDoesntExist', 1;
  END;

  DECLARE @idNote INTEGER;
  DECLARE @currentDateTime DATETIME2 = GETUTCDATE();

  BEGIN TRY
    /**
     * @rule {db-note-creation} Insert new note with validated parameters
     */
    BEGIN TRAN;

      INSERT INTO [functional].[note]
      ([idAccount], [titulo], [conteudo], [cor], [dateCreated], [dateModified])
      VALUES
      (@idAccount, @titulo, @conteudo, @cor, @currentDateTime, @currentDateTime);

      SET @idNote = SCOPE_IDENTITY();

      /**
       * @output {NoteCreated, 1, 1}
       * @column {INT} idNote
       * - Description: Identifier of the created note
       */
      SELECT @idNote AS [idNote];

    COMMIT TRAN;
  END TRY
  BEGIN CATCH
    ROLLBACK TRAN;
    THROW;
  END CATCH;
END;
GO

-- File: functional/note/spNoteDelete.sql
/**
 * @summary
 * Permanently deletes a note from the database after validation.
 * This is a hard delete operation that cannot be undone.
 *
 * @procedure spNoteDelete
 * @schema functional
 * @type stored-procedure
 *
 * @endpoints
 * - DELETE /api/v1/internal/note/:id
 *
 * @parameters
 * @param {INT} idAccount
 *   - Required: Yes
 *   - Description: Account identifier for multi-tenancy isolation
 *
 * @param {INT} idUser
 *   - Required: Yes
 *   - Description: User identifier for audit purposes
 *
 * @param {INT} idNote
 *   - Required: Yes
 *   - Description: Note identifier to delete
 *
 * @testScenarios
 * - Valid deletion with existing note
 * - Validation failure for non-existent note
 * - Security validation with mismatched account
 */
CREATE OR ALTER PROCEDURE [functional].[spNoteDelete]
  @idAccount INTEGER,
  @idUser INTEGER,
  @idNote INTEGER
AS
BEGIN
  SET NOCOUNT ON;

  /**
   * @validation Required parameter validation
   * @throw {idAccountRequired}
   */
  IF @idAccount IS NULL
  BEGIN
    ;THROW 51000, 'idAccountRequired', 1;
  END;

  /**
   * @validation Required parameter validation
   * @throw {idUserRequired}
   */
  IF @idUser IS NULL
  BEGIN
    ;THROW 51000, 'idUserRequired', 1;
  END;

  /**
   * @validation Required parameter validation
   * @throw {idNoteRequired}
   */
  IF @idNote IS NULL
  BEGIN
    ;THROW 51000, 'idNoteRequired', 1;
  END;

  /**
   * @validation Note existence and account ownership validation
   * @throw {noteDoesntExist}
   */
  IF NOT EXISTS (SELECT * FROM [functional].[note] nte WHERE nte.[idNote] = @idNote AND nte.[idAccount] = @idAccount)
  BEGIN
    ;THROW 51000, 'noteDoesntExist', 1;
  END;

  BEGIN TRY
    /**
     * @rule {db-note-deletion} Permanently delete note from database
     */
    BEGIN TRAN;

      DELETE FROM [functional].[note]
      WHERE [idNote] = @idNote
        AND [idAccount] = @idAccount;

      /**
       * @output {NoteDeleted, 1, 1}
       * @column {INT} idNote
       * - Description: Identifier of the deleted note
       */
      SELECT @idNote AS [idNote];

    COMMIT TRAN;
  END TRY
  BEGIN CATCH
    ROLLBACK TRAN;
    THROW;
  END CATCH;
END;
GO

-- File: functional/note/spNoteGet.sql
/**
 * @summary
 * Retrieves a specific note by its identifier with account validation.
 *
 * @procedure spNoteGet
 * @schema functional
 * @type stored-procedure
 *
 * @endpoints
 * - GET /api/v1/internal/note/:id
 *
 * @parameters
 * @param {INT} idAccount
 *   - Required: Yes
 *   - Description: Account identifier for multi-tenancy isolation
 *
 * @param {INT} idNote
 *   - Required: Yes
 *   - Description: Note identifier
 *
 * @testScenarios
 * - Retrieve existing note with valid parameters
 * - Validation failure for non-existent note
 * - Security validation with mismatched account
 */
CREATE OR ALTER PROCEDURE [functional].[spNoteGet]
  @idAccount INTEGER,
  @idNote INTEGER
AS
BEGIN
  SET NOCOUNT ON;

  /**
   * @validation Required parameter validation
   * @throw {idAccountRequired}
   */
  IF @idAccount IS NULL
  BEGIN
    ;THROW 51000, 'idAccountRequired', 1;
  END;

  /**
   * @validation Required parameter validation
   * @throw {idNoteRequired}
   */
  IF @idNote IS NULL
  BEGIN
    ;THROW 51000, 'idNoteRequired', 1;
  END;

  /**
   * @validation Note existence and account ownership validation
   * @throw {noteDoesntExist}
   */
  IF NOT EXISTS (SELECT * FROM [functional].[note] nte WHERE nte.[idNote] = @idNote AND nte.[idAccount] = @idAccount)
  BEGIN
    ;THROW 51000, 'noteDoesntExist', 1;
  END;

  /**
   * @rule {db-note-retrieval} Retrieve specific note details
   */
  /**
   * @output {NoteDetails, 1, n}
   * @column {INT} idNote
   * - Description: Note identifier
   * @column {NVARCHAR(100)} titulo
   * - Description: Note title
   * @column {NVARCHAR(MAX)} conteudo
   * - Description: Note content
   * @column {VARCHAR(50)} cor
   * - Description: Note color
   * @column {DATETIME2} dateCreated
   * - Description: Note creation timestamp
   * @column {DATETIME2} dateModified
   * - Description: Note last modification timestamp
   */
  SELECT
    [nte].[idNote],
    [nte].[titulo],
    [nte].[conteudo],
    [nte].[cor],
    [nte].[dateCreated],
    [nte].[dateModified]
  FROM [functional].[note] [nte]
  WHERE [nte].[idNote] = @idNote
    AND [nte].[idAccount] = @idAccount;
END;
GO

-- File: functional/note/spNoteList.sql
/**
 * @summary
 * Lists all notes for an account with optional filtering by color
 * and sorting by different criteria (dateCreated, dateModified, titulo).
 *
 * @procedure spNoteList
 * @schema functional
 * @type stored-procedure
 *
 * @endpoints
 * - GET /api/v1/internal/note
 *
 * @parameters
 * @param {INT} idAccount
 *   - Required: Yes
 *   - Description: Account identifier for multi-tenancy isolation
 *
 * @param {VARCHAR(50)} filterCor
 *   - Required: No
 *   - Description: Filter notes by color ('todas' for all colors)
 *
 * @param {VARCHAR(50)} orderBy
 *   - Required: No
 *   - Description: Sort field (dateCreated, dateModified, titulo)
 *
 * @param {VARCHAR(4)} direction
 *   - Required: No
 *   - Description: Sort direction (asc or desc)
 *
 * @testScenarios
 * - List all notes with default sorting
 * - List notes filtered by specific color
 * - List notes sorted by titulo ascending
 * - List notes sorted by dateCreated descending
 * - Security validation with invalid account
 */
CREATE OR ALTER PROCEDURE [functional].[spNoteList]
  @idAccount INTEGER,
  @filterCor VARCHAR(50) = 'todas',
  @orderBy VARCHAR(50) = 'dateModified',
  @direction VARCHAR(4) = 'desc'
AS
BEGIN
  SET NOCOUNT ON;

  /**
   * @validation Required parameter validation
   * @throw {idAccountRequired}
   */
  IF @idAccount IS NULL
  BEGIN
    ;THROW 51000, 'idAccountRequired', 1;
  END;

  /**
   * @validation Account existence validation
   * @throw {accountDoesntExist}
   */
  IF NOT EXISTS (SELECT * FROM [subscription].[account] acc WHERE acc.[idAccount] = @idAccount)
  BEGIN
    ;THROW 51000, 'accountDoesntExist', 1;
  END;

  /**
   * @validation OrderBy parameter validation
   * @throw {invalidOrderByParameter}
   */
  IF @orderBy NOT IN ('dateCreated', 'dateModified', 'titulo')
  BEGIN
    ;THROW 51000, 'invalidOrderByParameter', 1;
  END;

  /**
   * @validation Direction parameter validation
   * @throw {invalidDirectionParameter}
   */
  IF @direction NOT IN ('asc', 'desc')
  BEGIN
    ;THROW 51000, 'invalidDirectionParameter', 1;
  END;

  /**
   * @rule {db-note-listing} Retrieve notes with filtering and sorting
   */
  /**
   * @output {NoteList, n, n}
   * @column {INT} idNote
   * - Description: Note identifier
   * @column {NVARCHAR(100)} titulo
   * - Description: Note title
   * @column {NVARCHAR(MAX)} conteudo
   * - Description: Note content
   * @column {VARCHAR(50)} cor
   * - Description: Note color
   * @column {DATETIME2} dateCreated
   * - Description: Note creation timestamp
   * @column {DATETIME2} dateModified
   * - Description: Note last modification timestamp
   */
  SELECT
    [nte].[idNote],
    [nte].[titulo],
    [nte].[conteudo],
    [nte].[cor],
    [nte].[dateCreated],
    [nte].[dateModified]
  FROM [functional].[note] [nte]
  WHERE [nte].[idAccount] = @idAccount
    AND (@filterCor = 'todas' OR [nte].[cor] = @filterCor)
  ORDER BY
    CASE WHEN @orderBy = 'dateModified' AND @direction = 'desc' THEN [nte].[dateModified] END DESC,
    CASE WHEN @orderBy = 'dateModified' AND @direction = 'asc' THEN [nte].[dateModified] END ASC,
    CASE WHEN @orderBy = 'dateCreated' AND @direction = 'desc' THEN [nte].[dateCreated] END DESC,
    CASE WHEN @orderBy = 'dateCreated' AND @direction = 'asc' THEN [nte].[dateCreated] END ASC,
    CASE WHEN @orderBy = 'titulo' AND @direction = 'desc' THEN [nte].[titulo] END DESC,
    CASE WHEN @orderBy = 'titulo' AND @direction = 'asc' THEN [nte].[titulo] END ASC;
END;
GO

-- File: functional/note/spNoteUpdate.sql
/**
 * @summary
 * Updates an existing note's titulo, conteudo, and cor.
 * Automatically updates dateModified timestamp.
 *
 * @procedure spNoteUpdate
 * @schema functional
 * @type stored-procedure
 *
 * @endpoints
 * - PUT /api/v1/internal/note/:id
 *
 * @parameters
 * @param {INT} idAccount
 *   - Required: Yes
 *   - Description: Account identifier for multi-tenancy isolation
 *
 * @param {INT} idUser
 *   - Required: Yes
 *   - Description: User identifier for audit purposes
 *
 * @param {INT} idNote
 *   - Required: Yes
 *   - Description: Note identifier to update
 *
 * @param {NVARCHAR(100)} titulo
 *   - Required: Yes
 *   - Description: Updated note title (3-100 characters)
 *
 * @param {NVARCHAR(MAX)} conteudo
 *   - Required: Yes
 *   - Description: Updated note content (1-5000 characters)
 *
 * @param {VARCHAR(50)} cor
 *   - Required: No
 *   - Description: Updated note color
 *
 * @testScenarios
 * - Valid update with all parameters
 * - Validation failure for titulo length constraints
 * - Validation failure for conteudo length constraints
 * - Validation failure for non-existent note
 * - Security validation with mismatched account
 */
CREATE OR ALTER PROCEDURE [functional].[spNoteUpdate]
  @idAccount INTEGER,
  @idUser INTEGER,
  @idNote INTEGER,
  @titulo NVARCHAR(100),
  @conteudo NVARCHAR(MAX),
  @cor VARCHAR(50)
AS
BEGIN
  SET NOCOUNT ON;

  /**
   * @validation Required parameter validation
   * @throw {idAccountRequired}
   */
  IF @idAccount IS NULL
  BEGIN
    ;THROW 51000, 'idAccountRequired', 1;
  END;

  /**
   * @validation Required parameter validation
   * @throw {idUserRequired}
   */
  IF @idUser IS NULL
  BEGIN
    ;THROW 51000, 'idUserRequired', 1;
  END;

  /**
   * @validation Required parameter validation
   * @throw {idNoteRequired}
   */
  IF @idNote IS NULL
  BEGIN
    ;THROW 51000, 'idNoteRequired', 1;
  END;

  /**
   * @validation Required parameter validation
   * @throw {tituloRequired}
   */
  IF @titulo IS NULL OR LEN(@titulo) = 0
  BEGIN
    ;THROW 51000, 'tituloRequired', 1;
  END;

  /**
   * @validation Titulo length validation
   * @throw {tituloTooShort}
   */
  IF LEN(@titulo) < 3
  BEGIN
    ;THROW 51000, 'tituloTooShort', 1;
  END;

  /**
   * @validation Titulo length validation
   * @throw {tituloTooLong}
   */
  IF LEN(@titulo) > 100
  BEGIN
    ;THROW 51000, 'tituloTooLong', 1;
  END;

  /**
   * @validation Required parameter validation
   * @throw {conteudoRequired}
   */
  IF @conteudo IS NULL OR LEN(@conteudo) = 0
  BEGIN
    ;THROW 51000, 'conteudoRequired', 1;
  END;

  /**
   * @validation Conteudo length validation
   * @throw {conteudoTooLong}
   */
  IF LEN(@conteudo) > 5000
  BEGIN
    ;THROW 51000, 'conteudoTooLong', 1;
  END;

  /**
   * @validation Note existence and account ownership validation
   * @throw {noteDoesntExist}
   */
  IF NOT EXISTS (SELECT * FROM [functional].[note] nte WHERE nte.[idNote] = @idNote AND nte.[idAccount] = @idAccount)
  BEGIN
    ;THROW 51000, 'noteDoesntExist', 1;
  END;

  DECLARE @currentDateTime DATETIME2 = GETUTCDATE();

  BEGIN TRY
    /**
     * @rule {db-note-update} Update note with validated parameters
     */
    BEGIN TRAN;

      UPDATE [functional].[note]
      SET
        [titulo] = @titulo,
        [conteudo] = @conteudo,
        [cor] = @cor,
        [dateModified] = @currentDateTime
      WHERE [idNote] = @idNote
        AND [idAccount] = @idAccount;

      /**
       * @output {NoteUpdated, 1, 1}
       * @column {INT} idNote
       * - Description: Identifier of the updated note
       */
      SELECT @idNote AS [idNote];

    COMMIT TRAN;
  END TRY
  BEGIN CATCH
    ROLLBACK TRAN;
    THROW;
  END CATCH;
END;
GO


-- ============================================
-- Migration completed successfully
-- ============================================

PRINT 'Migration completed successfully!';
GO
